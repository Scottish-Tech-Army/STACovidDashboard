package org.scottishtecharmy.homebrewdemo;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
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

/**
 * A simple test harness for locally invoking your Lambda function handler.
 */
@RunWith(MockitoJUnitRunner.class)
public class LambdaFunctionHandlerTest {

    private S3Event event;

    @Mock
    private AmazonS3 s3Client;
    @Mock
    private S3Object s3Object;
    @Mock
    private PutObjectResult putObjectResult;
    @Mock
    private CloseableHttpClient httpClient;
    @Mock
    private CloseableHttpResponse httpResponse;

    private LambdaFunctionHandler subject;

    @Captor
    private ArgumentCaptor<GetObjectRequest> getObjectRequest;

    ArgumentCaptor<HttpPost> postRequestCaptor = ArgumentCaptor.forClass(HttpPost.class);
    ArgumentCaptor<PutObjectRequest> s3RequestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);

    @Before
    public void setUp() throws IOException {
        event = TestUtils.parse("/s3-event.put.json", S3Event.class);

        subject = spy(new LambdaFunctionHandler(s3Client));

        when(s3Client.putObject(s3RequestCaptor.capture())).thenReturn(putObjectResult);
        when(subject.createHttpClient()).thenReturn(httpClient);
        when(httpClient.execute(postRequestCaptor.capture())).thenReturn(httpResponse);
        when(httpResponse.getEntity()).thenReturn(new StringEntity("testoutput1"), new StringEntity("testoutput2"),
                new StringEntity("testoutput3"), new StringEntity("testoutput4"), new StringEntity("testoutput5"),
                new StringEntity("testoutput6"), new StringEntity("testoutput7"), new StringEntity("testoutput8"),
                new StringEntity("unexpected"));
    }

    private Context createContext() {
        return new TestContext();
    }

    @Test
    public void testLambdaFunctionHandler() throws UnsupportedOperationException, IOException {
        Context ctx = createContext();

        String output = subject.handleRequest(event, ctx);

        assertEquals("Success", output);
        List<HttpPost> postRequests = postRequestCaptor.getAllValues();
        assertEquals(8, postRequests.size());
        for (HttpPost postRequest : postRequests) {
            checkPostRequest(postRequest);
        }

        List<PutObjectRequest> s3Requests = s3RequestCaptor.getAllValues();
        assertEquals(8, s3Requests.size());

        String[] expectedKeys = new String[] { "data/weeklyHealthBoardsDeaths.csv",
                "data/dailyScottishCasesAndDeaths.csv", "data/weeklyCouncilAreasDeaths.csv",
                "data/dailyHealthBoardsCases.csv", "data/summaryCounts.csv", "data/totalHealthBoardsCases.csv",
                "data/annualHealthBoardsDeaths.csv", "data/annualCouncilAreasDeaths.csv", };
        assertArrayEquals(expectedKeys, s3Requests.stream().map(PutObjectRequest::getKey).toArray());

        String[] expectedContents = new String[] { "testoutput1", "testoutput2", "testoutput3", "testoutput4",
                "testoutput5", "testoutput6", "testoutput7", "testoutput8", };
        assertArrayEquals(expectedContents, s3Requests.stream().map(PutObjectRequest::getInputStream).map(this::readInputStream).toArray());
    }

    private void checkPostRequest(HttpPost postRequest) throws UnsupportedOperationException, IOException {
        assertEquals("https://statistics.gov.scot/sparql.csv", postRequest.getURI().toString());
        String text = readInputStream(postRequest.getEntity().getContent());
        System.out.println(text);
        assertTrue(text.contains("SELECT"));
    }

    private String readInputStream(InputStream inputStream) {
        return new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines()
                .collect(Collectors.joining("\n"));
    }
}
