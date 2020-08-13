package org.scottishtecharmy.homebrewdemo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicHeader;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.stubbing.OngoingStubbing;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

/**
 * A simple test harness for locally invoking your Lambda function handler.
 */
@RunWith(MockitoJUnitRunner.class)
public class LambdaFunctionHandlerTest {

    private S3Event event;
    private Context context;

    @Mock
    private AmazonS3 s3Client;
    @Mock
    private S3Object retrievedDateModifiedObject;
    @Mock
    private PutObjectResult putObjectResult;
    @Mock
    private S3Object getObjectResult;
    @Mock
    private CloseableHttpClient httpClient;

    private LambdaFunctionHandler subject;

    @Captor
    private ArgumentCaptor<GetObjectRequest> getObjectRequest;

    ArgumentCaptor<HttpUriRequest> httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
    ArgumentCaptor<PutObjectRequest> s3WriteCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
    ArgumentCaptor<GetObjectRequest> s3ReadCaptor = ArgumentCaptor.forClass(GetObjectRequest.class);

    private static final String DATES_MODIFIED_CONTENT = "datesmodified.output";
    private static final String LAST_MODIFIED_DATE_DAILY_HB = "Mon, 10 Aug 2020 12:00:28 GMT";
    private static final String LAST_MODIFIED_DATE_DAILY_CA = "Mon, 10 Aug 2020 13:00:28 GMT";
    private static final String LAST_MODIFIED_DATE_TOTAL_HB = "Mon, 10 Aug 2020 14:00:28 GMT";

    // Flatten an array of arrays into a single array - unfortunately generics
    // don't work here
    private static String[][] flatten(String[][]... arrays) {
        return Arrays.stream(arrays).flatMap(o -> Arrays.stream(o)).toArray(String[][]::new);
    }

    private static CloseableHttpResponse[] flatten(CloseableHttpResponse[]... arrays) {
        return Arrays.stream(arrays).flatMap(o -> Arrays.stream(o)).toArray(CloseableHttpResponse[]::new);
    }

    private static final String[][] EXPECTED_S3_PUT_OBJECTS_SPARQL_DATA = {
            { "data/weeklyHealthBoardsDeaths.csv", "weeklyHealthBoardsDeaths.output" },
            { "data/dailyScottishCasesAndDeaths.csv", "dailyScottishCasesAndDeaths.output" },
            { "data/weeklyCouncilAreasDeaths.csv", "weeklyCouncilAreasDeaths.output" },
            { "data/dailyHealthBoardsCases.csv", "dailyHealthBoardsCases.output", },
            { "data/analysis/dailyHealthBoardsCasesAndPatients.csv", "dailyHealthBoardsCasesAndPatients.output" },
            { "data/summaryCounts.csv", "summaryCounts.output" },
            { "data/annualHealthBoardsDeaths.csv", "annualHealthBoardsDeaths.output" },
            { "data/annualCouncilAreasDeaths.csv", "annualCouncilAreasDeaths.output" },
            { "data/datesmodified.csv", DATES_MODIFIED_CONTENT } };

    private static final String[][] EXPECTED_S3_PUT_OBJECTS_NHS_DAILY_CA_DATA = {
            { "data/dailyCouncilAreas.csv", "dailyCouncilAreas.output", },
            { "data/nhsDailyCouncilAreaLastModified.txt", LAST_MODIFIED_DATE_DAILY_CA }, };

    private static final String[][] EXPECTED_S3_PUT_OBJECTS_NHS_DAILY_HB_DATA = {
            { "data/dailyHealthBoards.csv", "dailyHealthBoards.output" },
            { "data/nhsDailyHealthBoardLastModified.txt", LAST_MODIFIED_DATE_DAILY_HB }, };

    private static final String[][] EXPECTED_S3_PUT_OBJECTS_NHS_TOTAL_HB_DATA = {
            { "data/currentTotalsHealthBoards.csv", "currentTotalsHealthBoards.output" },
            { "data/nhsTotalHealthBoardLastModified.txt", LAST_MODIFIED_DATE_TOTAL_HB }, };

    private static final String[][] EXPECTED_S3_PUT_OBJECTS_NHS_DATA = flatten(
            EXPECTED_S3_PUT_OBJECTS_NHS_DAILY_CA_DATA, EXPECTED_S3_PUT_OBJECTS_NHS_DAILY_HB_DATA,
            EXPECTED_S3_PUT_OBJECTS_NHS_TOTAL_HB_DATA);

    private static final String[][] EXPECTED_S3_PUT_OBJECTS_RSS_DATA = {
            { "data/newsScotGovRss.xml", "newsScotGovRss.output" }, };

    private static final String[][] EXPECTED_S3_PUT_OBJECTS_ALL = flatten(EXPECTED_S3_PUT_OBJECTS_SPARQL_DATA,
            EXPECTED_S3_PUT_OBJECTS_NHS_DATA, EXPECTED_S3_PUT_OBJECTS_RSS_DATA);

    private static CloseableHttpResponse createHttpResponse(String content, int statusCode, String lastModifiedDate) {
        CloseableHttpResponse response = Mockito.mock(CloseableHttpResponse.class);
        StatusLine statusLine = Mockito.mock(StatusLine.class);

        try {
            when(response.getEntity()).thenReturn(new StringEntity(content));
            when(response.getStatusLine()).thenReturn(statusLine);
            when(statusLine.getStatusCode()).thenReturn(statusCode);
            if (lastModifiedDate != null) {
                when(response.getFirstHeader("Last-Modified"))
                        .thenReturn(new BasicHeader("Last-Modified", lastModifiedDate));
            }
        }
        catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    private static CloseableHttpResponse createHttpResponse(String content) {
        return createHttpResponse(content, 200, null);
    }

    // statistics.scot.gov responses
    // Note difference in ordering
    private static final CloseableHttpResponse[] HTTP_QUERY_RESPONSES_SPARQL = {
            createHttpResponse(DATES_MODIFIED_CONTENT), createHttpResponse("weeklyHealthBoardsDeaths.output"),
            createHttpResponse("dailyScottishCasesAndDeaths.output"),
            createHttpResponse("weeklyCouncilAreasDeaths.output"), createHttpResponse("dailyHealthBoardsCases.output"),
            createHttpResponse("dailyHealthBoardsCasesAndPatients.output"), createHttpResponse("summaryCounts.output"),
            createHttpResponse("annualHealthBoardsDeaths.output"),
            createHttpResponse("annualCouncilAreasDeaths.output"), };

    // nhs.scot responses
    private static final CloseableHttpResponse[] HTTP_QUERY_RESPONSES_NHS = {
            createHttpResponse("dailyCouncilAreas.output", 200, LAST_MODIFIED_DATE_DAILY_CA),
            createHttpResponse("dailyHealthBoards.output", 200, LAST_MODIFIED_DATE_DAILY_HB),
            createHttpResponse("currentTotalsHealthBoards.output", 200, LAST_MODIFIED_DATE_TOTAL_HB), };

    // rss feed response
    private static final CloseableHttpResponse[] HTTP_QUERY_RESPONSES_RSS = {
            createHttpResponse("newsScotGovRss.output"), };

    // Unexpected additional responses
    private static final CloseableHttpResponse[] HTTP_QUERY_RESPONSES_UNEXPECTED = { createHttpResponse("UNEXPECTED") };

    private static final CloseableHttpResponse[] HTTP_QUERY_RESPONSES = flatten(HTTP_QUERY_RESPONSES_SPARQL,
            HTTP_QUERY_RESPONSES_NHS, HTTP_QUERY_RESPONSES_RSS, HTTP_QUERY_RESPONSES_UNEXPECTED);

    @Before
    public void setUp() throws IOException {
        context = new TestContext();
        event = TestUtils.parse("/s3-event.put.json", S3Event.class);
        subject = spy(new LambdaFunctionHandler(s3Client));

        // Handle S3 puts
        when(s3Client.putObject(s3WriteCaptor.capture())).thenReturn(putObjectResult);

        // Handle S3 gets
        mockStoredS3Object(retrievedDateModifiedObject, "data/datesmodified.csv", "datesoriginal.output");
        mockStoredS3Object(Mockito.mock(S3Object.class), "data/nhsDailyHealthBoardLastModified.txt",
                LAST_MODIFIED_DATE_DAILY_HB);
        mockStoredS3Object(Mockito.mock(S3Object.class), "data/nhsDailyCouncilAreaLastModified.txt",
                LAST_MODIFIED_DATE_DAILY_CA);
        mockStoredS3Object(Mockito.mock(S3Object.class), "data/nhsTotalHealthBoardLastModified.txt",
                LAST_MODIFIED_DATE_TOTAL_HB);

        // Handle external HTTP queries
        when(subject.createHttpClient()).thenReturn(httpClient);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), HTTP_QUERY_RESPONSES);
    }

    private void mockStoredS3Object(S3Object mockS3Object, String objectKey, String content) {
        when(s3Client.doesObjectExist("dashboard.aws.scottishtecharmy.org", objectKey)).thenReturn(true);
        when(s3Client.getObject("dashboard.aws.scottishtecharmy.org", objectKey)).thenReturn(mockS3Object);
        when(mockS3Object.getObjectContent())
                .thenReturn(new S3ObjectInputStream(new ByteArrayInputStream(content.getBytes()), null));
    }

    // An helper when wanting to return a sequence of responses stored as an
    // array
    @SuppressWarnings("unchecked")
    private static final <T> OngoingStubbing<T> returnMultiple(OngoingStubbing<T> input, T[] responses) {
        T first = responses[0];
        T[] rest = (T[]) new Object[responses.length - 1];
        System.arraycopy(responses, 1, rest, 0, responses.length - 1);

        return input.thenReturn(first, rest);
    }

    @Test
    public void testIsDateModified() {
        // If either new or old data are null or empty, then return true
        assertTrue(subject.isDateModified("", "data"));
        assertTrue(subject.isDateModified("data", ""));
        assertTrue(subject.isDateModified(null, "data"));
        assertTrue(subject.isDateModified("data", null));

        // If new and old data are different, then return true
        assertTrue(subject.isDateModified("data", "other"));

        // Otherwise return false
        assertFalse(subject.isDateModified("data", "data"));
    }

    @Test
    public void testLambdaFunctionHandler_dateNotModified() throws UnsupportedOperationException, IOException {
        when(retrievedDateModifiedObject.getObjectContent())
                .thenReturn(new S3ObjectInputStream(new ByteArrayInputStream(DATES_MODIFIED_CONTENT.getBytes()), null));

        CloseableHttpResponse[] httpResponses = flatten(
                new CloseableHttpResponse[] { createHttpResponse(DATES_MODIFIED_CONTENT), }, HTTP_QUERY_RESPONSES_NHS,
                HTTP_QUERY_RESPONSES_RSS, HTTP_QUERY_RESPONSES_UNEXPECTED);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        assertEquals("Success", subject.handleRequest(event, context));

        checkRequests_sparqlDataRequestsNotMade();
        checkS3Writes(flatten(EXPECTED_S3_PUT_OBJECTS_NHS_DATA, EXPECTED_S3_PUT_OBJECTS_RSS_DATA));
    }

    @Test
    public void testLambdaFunctionHandler_dateModified() throws UnsupportedOperationException, IOException {

        String output = subject.handleRequest(event, context);
        assertEquals("Success", output);

        checkRequests_allRequestsMade();
        checkS3Writes(EXPECTED_S3_PUT_OBJECTS_ALL);
    }

    @Test
    public void testLambdaFunctionHandler_storedDateModifiedMissing()
            throws UnsupportedOperationException, IOException {
        when(s3Client.doesObjectExist("dashboard.aws.scottishtecharmy.org", "data/datesmodified.csv"))
                .thenReturn(false);

        assertEquals("Success", subject.handleRequest(event, context));

        checkRequests_allRequestsMade();
        checkS3Writes(EXPECTED_S3_PUT_OBJECTS_ALL);
    }

    @Test
    public void testLambdaFunctionHandler_storedNhsHealthBoardDateModifiedMissing()
            throws UnsupportedOperationException, IOException {
        when(s3Client.doesObjectExist("dashboard.aws.scottishtecharmy.org", "data/nhsDailyHealthBoardLastModified.txt"))
                .thenReturn(false);

        assertEquals("Success", subject.handleRequest(event, context));

        checkRequests_allRequestsMade();
        checkS3Writes(EXPECTED_S3_PUT_OBJECTS_ALL);

        List<HttpUriRequest> httpRequests = httpRequestCaptor.getAllValues();
        checkNhsGetRequestModificationDate((HttpGet) httpRequests.get(9), LAST_MODIFIED_DATE_DAILY_CA);
        checkNhsGetRequestModificationDate((HttpGet) httpRequests.get(10), null);
    }

    @Test
    public void testLambdaFunctionHandler_storedNhsCouncilAreaDateModifiedMissing()
            throws UnsupportedOperationException, IOException {
        when(s3Client.doesObjectExist("dashboard.aws.scottishtecharmy.org", "data/nhsDailyCouncilAreaLastModified.txt"))
                .thenReturn(false);

        assertEquals("Success", subject.handleRequest(event, context));

        checkRequests_allRequestsMade();
        checkS3Writes(EXPECTED_S3_PUT_OBJECTS_ALL);
    }

    @Test
    public void testLambdaFunctionHandler_storedNhsDailyCouncilAreaNotUpdated()
            throws UnsupportedOperationException, IOException {

        CloseableHttpResponse[] httpResponses = flatten(HTTP_QUERY_RESPONSES_SPARQL,
                new CloseableHttpResponse[] {
                        createHttpResponse("dailyCouncilAreas.output", 304, LAST_MODIFIED_DATE_DAILY_CA),
                        createHttpResponse("dailyHealthBoards.output", 200, LAST_MODIFIED_DATE_DAILY_HB),
                        createHttpResponse("currentTotalsHealthBoards.output", 200, LAST_MODIFIED_DATE_TOTAL_HB), },
                HTTP_QUERY_RESPONSES_RSS, HTTP_QUERY_RESPONSES_UNEXPECTED);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        assertEquals("Success", subject.handleRequest(event, context));

        checkRequests_allRequestsMade();
        checkS3Writes(flatten(EXPECTED_S3_PUT_OBJECTS_SPARQL_DATA, EXPECTED_S3_PUT_OBJECTS_NHS_DAILY_HB_DATA,EXPECTED_S3_PUT_OBJECTS_NHS_TOTAL_HB_DATA,
                EXPECTED_S3_PUT_OBJECTS_RSS_DATA));
    }

    @Test
    public void testLambdaFunctionHandler_storedNhsDailyHealthBoardNotUpdated()
            throws UnsupportedOperationException, IOException {

        CloseableHttpResponse[] httpResponses = flatten(HTTP_QUERY_RESPONSES_SPARQL,
                new CloseableHttpResponse[] {
                        createHttpResponse("dailyCouncilAreas.output", 200, LAST_MODIFIED_DATE_DAILY_CA),
                        createHttpResponse("dailyHealthBoards.output", 304, LAST_MODIFIED_DATE_DAILY_HB),
                        createHttpResponse("currentTotalsHealthBoards.output", 200, LAST_MODIFIED_DATE_TOTAL_HB), },
                HTTP_QUERY_RESPONSES_RSS, HTTP_QUERY_RESPONSES_UNEXPECTED);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        String output = subject.handleRequest(event, context);
        assertEquals("Success", output);

        checkRequests_allRequestsMade();
        checkS3Writes(flatten(EXPECTED_S3_PUT_OBJECTS_SPARQL_DATA, EXPECTED_S3_PUT_OBJECTS_NHS_DAILY_CA_DATA, EXPECTED_S3_PUT_OBJECTS_NHS_TOTAL_HB_DATA,
                EXPECTED_S3_PUT_OBJECTS_RSS_DATA));
    }

    @Test
    public void testLambdaFunctionHandler_storedNhsTotalHealthBoardNotUpdated()
            throws UnsupportedOperationException, IOException {

        CloseableHttpResponse[] httpResponses = flatten(HTTP_QUERY_RESPONSES_SPARQL,
                new CloseableHttpResponse[] {
                        createHttpResponse("dailyCouncilAreas.output", 200, LAST_MODIFIED_DATE_DAILY_CA),
                        createHttpResponse("dailyHealthBoards.output", 200, LAST_MODIFIED_DATE_DAILY_HB),
                        createHttpResponse("currentTotalsHealthBoards.output", 304, LAST_MODIFIED_DATE_TOTAL_HB), },
                HTTP_QUERY_RESPONSES_RSS, HTTP_QUERY_RESPONSES_UNEXPECTED);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        String output = subject.handleRequest(event, context);
        assertEquals("Success", output);

        checkRequests_allRequestsMade();
        checkS3Writes(flatten(EXPECTED_S3_PUT_OBJECTS_SPARQL_DATA, EXPECTED_S3_PUT_OBJECTS_NHS_DAILY_CA_DATA,EXPECTED_S3_PUT_OBJECTS_NHS_DAILY_HB_DATA,
                EXPECTED_S3_PUT_OBJECTS_RSS_DATA));
    }

    @Test
    public void testLambdaFunctionHandler_storedNhsDataNotUpdated() throws UnsupportedOperationException, IOException {

        CloseableHttpResponse[] httpResponses = flatten(HTTP_QUERY_RESPONSES_SPARQL,
                new CloseableHttpResponse[] {
                        createHttpResponse("dailyCouncilAreas.output", 304, LAST_MODIFIED_DATE_DAILY_CA),
                        createHttpResponse("dailyHealthBoards.output", 304, LAST_MODIFIED_DATE_DAILY_HB), 
                        createHttpResponse("currentTotalsHealthBoards.output", 304, LAST_MODIFIED_DATE_TOTAL_HB),},
                HTTP_QUERY_RESPONSES_RSS, HTTP_QUERY_RESPONSES_UNEXPECTED);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        assertEquals("Success", subject.handleRequest(event, context));

        checkRequests_allRequestsMade();
        checkS3Writes(flatten(EXPECTED_S3_PUT_OBJECTS_SPARQL_DATA, EXPECTED_S3_PUT_OBJECTS_RSS_DATA));
    }

    private void checkRequests_sparqlDataRequestsNotMade() throws UnsupportedOperationException, IOException {
        List<HttpUriRequest> httpRequests = httpRequestCaptor.getAllValues();
        assertEquals(5, httpRequests.size());

        // The first is a request to statistics.gov.scot
        checkSparQLPostRequest((HttpPost) httpRequests.get(0));

        // The next 3 are requests to nhs.scot
        checkNhsGetRequest((HttpGet) httpRequests.get(1));
        checkNhsGetRequest((HttpGet) httpRequests.get(2));
        checkNhsGetRequest((HttpGet) httpRequests.get(3));

        // The last is a request to news.gov.scot rss feed
        checkRssFeedGetRequest((HttpGet) httpRequests.get(4));
    }

    private void checkRequests_allRequestsMade() throws UnsupportedOperationException, IOException {
        List<HttpUriRequest> httpRequests = httpRequestCaptor.getAllValues();
        assertEquals(13, httpRequests.size());
        // The first 9 are requests to statistics.gov.scot
        for (int i = 0; i < 9; i++) {
            checkSparQLPostRequest((HttpPost) httpRequests.get(i));
        }

        // The next 2 are requests to nhs.scot
        checkNhsGetRequest((HttpGet) httpRequests.get(9));
        checkNhsGetRequest((HttpGet) httpRequests.get(10));
        checkNhsGetRequest((HttpGet) httpRequests.get(11));

        // The last is a request to news.gov.scot rss feed
        checkRssFeedGetRequest((HttpGet) httpRequests.get(12));
    }

    private void checkSparQLPostRequest(HttpPost postRequest) throws UnsupportedOperationException, IOException {
        assertEquals("https://statistics.gov.scot/sparql.csv", postRequest.getURI().toString());
        String text = readInputStream(postRequest.getEntity().getContent());
        assertTrue(text.contains("SELECT"));
    }

    private void checkRssFeedGetRequest(HttpGet getRequest) throws UnsupportedOperationException {
        assertEquals("https://news.gov.scot/feed/rss", getRequest.getURI().toString());
    }

    private void checkNhsGetRequest(HttpGet getRequest) throws UnsupportedOperationException {
        assertTrue(getRequest.getURI().toString()
                .startsWith("https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource"));
    }

    private void checkNhsGetRequestModificationDate(HttpGet getRequest, String lastModifiedDate)
            throws UnsupportedOperationException {
        if (lastModifiedDate == null) {
            assertFalse(getRequest.containsHeader("If-Modified-Since"));
        }
        else {
            assertEquals(lastModifiedDate, getRequest.getFirstHeader("If-Modified-Since").getValue());
        }
    }

    private String readInputStream(InputStream inputStream) {
        return new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines()
                .collect(Collectors.joining("\n"));
    }

    private void checkS3Writes(String[][] expectedS3Objects) throws UnsupportedOperationException {

        List<PutObjectRequest> s3Requests = s3WriteCaptor.getAllValues();
        assertEquals(expectedS3Objects.length, s3Requests.size());
        for (int i = 0; i < expectedS3Objects.length; i++) {
            assertEquals(expectedS3Objects[i][0], s3Requests.get(i).getKey());
            assertEquals(expectedS3Objects[i][1], readInputStream(s3Requests.get(i).getInputStream()));
        }
    }

}
