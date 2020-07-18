package org.scottishtecharmy.homebrewdemo;

import static org.junit.Assert.assertArrayEquals;
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
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

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
    @Mock
    private CloseableHttpResponse httpResponse;

    private LambdaFunctionHandler subject;

    @Captor
    private ArgumentCaptor<GetObjectRequest> getObjectRequest;

    ArgumentCaptor<HttpUriRequest> httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
    ArgumentCaptor<PutObjectRequest> s3WriteCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
    ArgumentCaptor<GetObjectRequest> s3ReadCaptor = ArgumentCaptor.forClass(GetObjectRequest.class);

    private static final String[] EXPECTED_S3_PUT_KEYS = { "data/weeklyHealthBoardsDeaths.csv",
            "data/dailyScottishCasesAndDeaths.csv", "data/weeklyCouncilAreasDeaths.csv",
            "data/dailyHealthBoardsCases.csv", "data/analysis/dailyHealthBoardsCasesAndPatients.csv",
            "data/summaryCounts.csv", "data/annualHealthBoardsDeaths.csv", "data/annualCouncilAreasDeaths.csv",
            "data/datesmodified.csv", "data/newsScotGovRss.xml" };

    private static final String DATES_MODIFIED_CONTENT = "datesmodified.output";

    private static final String[] EXPECTED_S3_PUT_OBJECTS = { "dailyScottishCasesAndDeaths.output",
            "weeklyCouncilAreasDeaths.output", "dailyHealthBoardsCases.output",
            "dailyHealthBoardsCasesAndPatients.output", "summaryCounts.output", "annualHealthBoardsDeaths.output",
            "annualCouncilAreasDeaths.output", "datesmodified.output", DATES_MODIFIED_CONTENT,
            "newsScotGovRss.output" };

    // Note difference in ordering
    private static final String[] HTTP_QUERY_RESPONSES = { DATES_MODIFIED_CONTENT, "dailyScottishCasesAndDeaths.output",
            "weeklyCouncilAreasDeaths.output", "dailyHealthBoardsCases.output",
            "dailyHealthBoardsCasesAndPatients.output", "summaryCounts.output", "annualHealthBoardsDeaths.output",
            "annualCouncilAreasDeaths.output", "datesmodified.output", "newsScotGovRss.output", "UNEXPECTED" };

    @Before
    public void setUp() throws IOException {
        context = createContext();

        event = TestUtils.parse("/s3-event.put.json", S3Event.class);

        subject = spy(new LambdaFunctionHandler(s3Client));

        // Handle S3 puts
        when(s3Client.putObject(s3WriteCaptor.capture())).thenReturn(putObjectResult);

        // Handle S3 last date modified retrieval
        when(s3Client.doesObjectExist("dashboard.aws.scottishtecharmy.org", "data/datesmodified.csv")).thenReturn(true);
        when(s3Client.getObject("dashboard.aws.scottishtecharmy.org", "data/datesmodified.csv"))
                .thenReturn(retrievedDateModifiedObject);
        when(retrievedDateModifiedObject.getObjectContent())
                .thenReturn(new S3ObjectInputStream(new ByteArrayInputStream("datesoriginal.output".getBytes()), null));

        // Handle external HTTP queries
        when(subject.createHttpClient()).thenReturn(httpClient);
        when(httpClient.execute(httpRequestCaptor.capture())).thenReturn(httpResponse);

        StringEntity[] ongoingResponses = new StringEntity[HTTP_QUERY_RESPONSES.length - 1];
        for (int i = 1; i < HTTP_QUERY_RESPONSES.length; i++) {
            ongoingResponses[i - 1] = new StringEntity(HTTP_QUERY_RESPONSES[i]);
        }
        when(httpResponse.getEntity()).thenReturn(new StringEntity(HTTP_QUERY_RESPONSES[0]), ongoingResponses);
    }

    private Context createContext() {
        return new TestContext();
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
        when(httpResponse.getEntity()).thenReturn(new StringEntity(DATES_MODIFIED_CONTENT),
                new StringEntity("newsScotGovRss.output"));

        String output = subject.handleRequest(event, context);
        assertEquals("Success", output);

        List<HttpUriRequest> httpRequests = httpRequestCaptor.getAllValues();
        assertEquals(2, httpRequests.size());
        // The first is a request to statistics.gov.scot
        checkSparQLPostRequest((HttpPost) httpRequests.get(0));
        // The last is a request to news.gov.scot rss feed
        checkRssFeedGetRequest((HttpGet) httpRequests.get(1));

        checkS3Writes(new String[] { "data/newsScotGovRss.xml" }, new String[] { "newsScotGovRss.output" });
    }

    @Test
    public void testLambdaFunctionHandler_dateModified() throws UnsupportedOperationException, IOException {

        String output = subject.handleRequest(event, context);
        assertEquals("Success", output);

        int expectedRequestCount = 10;
        List<HttpUriRequest> httpRequests = httpRequestCaptor.getAllValues();
        assertEquals(expectedRequestCount, httpRequests.size());
        // The first n - 1 are requests to statistics.gov.scot
        for (int i = 0; i < expectedRequestCount - 1; i++) {
            checkSparQLPostRequest((HttpPost) httpRequests.get(i));
        }
        // The last is a request to news.gov.scot rss feed
        checkRssFeedGetRequest((HttpGet) httpRequests.get(expectedRequestCount - 1));

        checkS3Writes(EXPECTED_S3_PUT_KEYS, EXPECTED_S3_PUT_OBJECTS);
    }

    @Test
    public void testLambdaFunctionHandler_storedDateModifiedMissing()
            throws UnsupportedOperationException, IOException {
        when(s3Client.doesObjectExist("dashboard.aws.scottishtecharmy.org", "data/datesmodified.csv"))
                .thenReturn(false);

        String output = subject.handleRequest(event, context);
        assertEquals("Success", output);

        List<HttpUriRequest> httpRequests = httpRequestCaptor.getAllValues();
        assertEquals(10, httpRequests.size());
        // The first 9 are requests to statistics.gov.scot
        for (int i = 0; i < 9; i++) {
            checkSparQLPostRequest((HttpPost) httpRequests.get(i));
        }
        // The last is a request to news.gov.scot rss feed
        checkRssFeedGetRequest((HttpGet) httpRequests.get(9));

        checkS3Writes(EXPECTED_S3_PUT_KEYS, EXPECTED_S3_PUT_OBJECTS);
    }

    private void checkSparQLPostRequest(HttpPost postRequest) throws UnsupportedOperationException, IOException {
        assertEquals("https://statistics.gov.scot/sparql.csv", postRequest.getURI().toString());
        String text = readInputStream(postRequest.getEntity().getContent());
        assertTrue(text.contains("SELECT"));
    }

    private void checkRssFeedGetRequest(HttpGet getRequest) throws UnsupportedOperationException {
        assertEquals("https://news.gov.scot/feed/rss", getRequest.getURI().toString());
    }

    private String readInputStream(InputStream inputStream) {
        return new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines()
                .collect(Collectors.joining("\n"));
    }

    private void checkS3Writes(String[] expectedS3Keys, String[] expectedS3Contents)
            throws UnsupportedOperationException {

        List<PutObjectRequest> s3Requests = s3WriteCaptor.getAllValues();
        assertEquals(expectedS3Keys.length, s3Requests.size());
        assertArrayEquals(expectedS3Keys, s3Requests.stream().map(PutObjectRequest::getKey).toArray());
        assertArrayEquals(expectedS3Contents,
                s3Requests.stream().map(PutObjectRequest::getInputStream).map(this::readInputStream).toArray());
    }

}
