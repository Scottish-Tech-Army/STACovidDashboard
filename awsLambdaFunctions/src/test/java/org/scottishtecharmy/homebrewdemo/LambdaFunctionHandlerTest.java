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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicHeader;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.stubbing.OngoingStubbing;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

@RunWith(MockitoJUnitRunner.class)
public class LambdaFunctionHandlerTest {

    private S3Event event;
    private Context context;

    @Mock
    private AmazonS3 s3Client;
    @Mock
    private PutObjectResult putObjectResult;
    @Mock
    private CloseableHttpClient httpClient;

    private LambdaFunctionHandler subject;

    ArgumentCaptor<HttpUriRequest> httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
    ArgumentCaptor<PutObjectRequest> s3WriteCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);

    private static final String OLD_LAST_MODIFIED_DATE = "Mon, 10 Aug 2020 12:00:28 GMT";
    private static final String NEW_LAST_MODIFIED_DATE = "Mon, 10 Aug 2020 16:00:28 GMT";

    private static class TestDataset {
        public final String s3ObjectKey;
        public final String fileContent;
        public final String s3ObjectLastModifiedKey;
        public final String s3ObjectLastModifiedDate;

        public TestDataset(String name, String s3ObjectLastModifiedDate) {
            this.s3ObjectKey = "data/" + name + ".csv";
            this.fileContent = name + ".output";
            this.s3ObjectLastModifiedKey = "data/" + name + "LastModified.txt";
            this.s3ObjectLastModifiedDate = s3ObjectLastModifiedDate;
        }
    }

    private static final String[] DATASET_NAMES = {
            "dailyCouncilAreas",
            "dailyHealthBoards",
            "currentTotalsCouncilAreas",
            "currentTotalsHealthBoards",
            "testsCouncilAreas",
            "testsHealthBoards",
            "dailyAndCumulativeTests",
            "weeklyTrendsByNeighbourhood",
            "dailyCaseTrendsByAgeAndSex",
            "dailyCaseTrendsByDeprivation",
            "hospitalOnset" };

    private static final List<TestDataset> EXPECTED_S3_PUT_OBJECTS_NHS_DATA = Arrays.stream(DATASET_NAMES)
            .map(name -> new TestDataset(name, NEW_LAST_MODIFIED_DATE))
            .collect(Collectors.toList());

    private static CloseableHttpResponse createHttpResponse(String content, int statusCode, String lastModifiedDate) {
        CloseableHttpResponse response = Mockito.mock(CloseableHttpResponse.class);
        StatusLine statusLine = Mockito.mock(StatusLine.class);

        try {
            when(response.getEntity()).thenReturn(new StringEntity(content));
            when(response.getStatusLine()).thenReturn(statusLine);
            when(statusLine.getStatusCode()).thenReturn(statusCode);
            when(response.getFirstHeader("Last-Modified"))
                    .thenReturn(new BasicHeader("Last-Modified", lastModifiedDate));
        }
        catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    // nhs.scot responses
    private CloseableHttpResponse[] getHttpQueryResponses(int status, String modifiedDate) {
        List<CloseableHttpResponse> responseList = Arrays.stream(DATASET_NAMES)
                .map(name -> createHttpResponse(name + ".output", status, modifiedDate))
                .collect(Collectors.toList());

        responseList.add(createHttpResponse("UNEXPECTED", 200, NEW_LAST_MODIFIED_DATE));
        return responseList.toArray(new CloseableHttpResponse[0]);
    }

    @Before
    public void setUp() throws IOException {
        context = new TestContext();
        event = TestUtils.parse("/s3-event.put.json", S3Event.class);
        subject = spy(new LambdaFunctionHandler(s3Client));

        // Handle S3 puts
        when(s3Client.putObject(s3WriteCaptor.capture())).thenReturn(putObjectResult);

        // Handle S3 gets
        for (TestDataset testDataset : EXPECTED_S3_PUT_OBJECTS_NHS_DATA) {
            mockStoredS3Object(Mockito.mock(S3Object.class), testDataset.s3ObjectLastModifiedKey,
                    OLD_LAST_MODIFIED_DATE);
        }

        // Handle external HTTP queries
        when(subject.createHttpClient()).thenReturn(httpClient);
        CloseableHttpResponse[] httpResponses = getHttpQueryResponses(200, NEW_LAST_MODIFIED_DATE);
        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);
    }

    @SuppressWarnings("resource")
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
    public void testHandleRequest_normalUpdate() throws UnsupportedOperationException {

        String output = subject.handleRequest(event, context);
        assertEquals("Success", output);

        checkAllRequestsMade();
        checkS3Writes(EXPECTED_S3_PUT_OBJECTS_NHS_DATA);
    }

    @Test
    public void testHandleRequest_oneFileDateModifiedMissing() throws UnsupportedOperationException {
        when(s3Client.doesObjectExist("dashboard.aws.scottishtecharmy.org", "data/dailyHealthBoardsLastModified.txt"))
                .thenReturn(false);

        assertEquals("Success", subject.handleRequest(event, context));

        checkAllRequestsMade();
        checkS3Writes(EXPECTED_S3_PUT_OBJECTS_NHS_DATA);

        List<HttpUriRequest> httpRequests = new ArrayList<>(httpRequestCaptor.getAllValues());
        
        // One should have no date
        checkNhsGetRequestNoModificationDate(httpRequests.remove(1));
        
        // Rest should have date
        for (HttpUriRequest httpRequest : httpRequests) {
            checkNhsGetRequestHasModificationDate(httpRequest, OLD_LAST_MODIFIED_DATE);
        }
    }

    @Test
    public void testHandleRequest_allFilesDateModifiedMissing() throws UnsupportedOperationException {
        for (TestDataset testDataset : EXPECTED_S3_PUT_OBJECTS_NHS_DATA) {
            when(s3Client.doesObjectExist("dashboard.aws.scottishtecharmy.org", testDataset.s3ObjectLastModifiedKey))
                    .thenReturn(false);
        }

        assertEquals("Success", subject.handleRequest(event, context));

        checkAllRequestsMade();
        checkS3Writes(EXPECTED_S3_PUT_OBJECTS_NHS_DATA);

        List<HttpUriRequest> httpRequests = httpRequestCaptor.getAllValues();
        for (HttpUriRequest httpRequest : httpRequests) {
            checkNhsGetRequestNoModificationDate(httpRequest);
        }
    }

    @Test
    public void testHandleRequest_oneFileNotUpdated() throws UnsupportedOperationException, IOException {

        CloseableHttpResponse[] httpResponses = getHttpQueryResponses(200, NEW_LAST_MODIFIED_DATE);
        httpResponses[1] = createHttpResponse("dailyHealthBoards.output", 304, OLD_LAST_MODIFIED_DATE);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        assertEquals("Success", subject.handleRequest(event, context));

        checkAllRequestsMade();

        List<TestDataset> expectedS3Writes = new ArrayList<>(EXPECTED_S3_PUT_OBJECTS_NHS_DATA);
        expectedS3Writes.remove(1);
        checkS3Writes(expectedS3Writes);
    }

    @Test
    public void testHandleRequest_allFilesNotUpdated() throws UnsupportedOperationException, IOException {

        CloseableHttpResponse[] httpResponses = getHttpQueryResponses(304, OLD_LAST_MODIFIED_DATE);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        assertEquals("Success", subject.handleRequest(event, context));

        checkAllRequestsMade();
        checkS3Writes(Collections.emptyList());
    }

    @Test
    public void testHandleRequest_oneFileNotUpdatedButReturned200()
            throws UnsupportedOperationException, IOException {

        CloseableHttpResponse[] httpResponses = getHttpQueryResponses(200, NEW_LAST_MODIFIED_DATE);
        httpResponses[1] = createHttpResponse("dailyHealthBoards.output", 200, OLD_LAST_MODIFIED_DATE);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        assertEquals("Success", subject.handleRequest(event, context));

        checkAllRequestsMade();

        List<TestDataset> expectedS3Writes = new ArrayList<>(EXPECTED_S3_PUT_OBJECTS_NHS_DATA);
        expectedS3Writes.remove(1);
        checkS3Writes(expectedS3Writes);
    }

    @Test
    public void testHandleRequest_allFilesNotUpdatedButReturned200()
            throws UnsupportedOperationException, IOException {

        CloseableHttpResponse[] httpResponses = getHttpQueryResponses(200, OLD_LAST_MODIFIED_DATE);

        httpRequestCaptor = ArgumentCaptor.forClass(HttpUriRequest.class);
        returnMultiple(when(httpClient.execute(httpRequestCaptor.capture())), httpResponses);

        assertEquals("Success", subject.handleRequest(event, context));

        checkAllRequestsMade();
        checkS3Writes(Collections.emptyList());
    }

    private void checkAllRequestsMade() throws UnsupportedOperationException {
        List<HttpUriRequest> httpRequests = httpRequestCaptor.getAllValues();
        assertEquals(EXPECTED_S3_PUT_OBJECTS_NHS_DATA.size(), httpRequests.size());

        Set<String> uniqueEndpoints = new HashSet<>();
        for (HttpUriRequest httpRequest : httpRequests) {
            String uri = httpRequest.getURI().toString();
            assertTrue(uri.startsWith("https://www.opendata.nhs.scot/dataset/"));
            uniqueEndpoints.add(uri);
        }
        assertEquals(EXPECTED_S3_PUT_OBJECTS_NHS_DATA.size(), uniqueEndpoints.size());
    }

    private void checkNhsGetRequestHasModificationDate(HttpUriRequest getRequest, String lastModifiedDate)
            throws UnsupportedOperationException {
        assertEquals(lastModifiedDate, getRequest.getFirstHeader("If-Modified-Since").getValue());
    }

    private void checkNhsGetRequestNoModificationDate(HttpUriRequest getRequest) throws UnsupportedOperationException {
        assertFalse(getRequest.containsHeader("If-Modified-Since"));
    }

    private String readInputStream(InputStream inputStream) {
        return new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines()
                .collect(Collectors.joining("\n"));
    }

    private void checkS3Writes(List<TestDataset> expectedS3Objects) throws UnsupportedOperationException {

        List<PutObjectRequest> s3Requests = s3WriteCaptor.getAllValues();
        assertEquals(expectedS3Objects.size() * 2, s3Requests.size());
        for (int i = 0; i < expectedS3Objects.size(); i++) {
            TestDataset expected = expectedS3Objects.get(i);
            PutObjectRequest actualDataObject = s3Requests.get(i * 2);
            PutObjectRequest actualLastModifiedObject = s3Requests.get(i * 2 + 1);
            
            assertEquals(expected.s3ObjectKey, actualDataObject.getKey());
            assertEquals(expected.fileContent, readInputStream(actualDataObject.getInputStream()));
            assertEquals(expected.s3ObjectLastModifiedKey, actualLastModifiedObject.getKey());
            assertEquals(expected.s3ObjectLastModifiedDate,
                    readInputStream(actualLastModifiedObject.getInputStream()));
        }
    }

}
