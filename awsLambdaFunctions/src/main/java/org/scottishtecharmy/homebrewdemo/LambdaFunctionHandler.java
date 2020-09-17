package org.scottishtecharmy.homebrewdemo;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AccessControlList;
import com.amazonaws.services.s3.model.GroupGrantee;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.Permission;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;

public class LambdaFunctionHandler implements RequestHandler<S3Event, String> {

    private AmazonS3 s3 = AmazonS3ClientBuilder.standard().withRegion(Regions.EU_WEST_2).build();

    public LambdaFunctionHandler() {
        // Default constructor
    }

    // Test purpose only.
    LambdaFunctionHandler(AmazonS3 s3) {
        this.s3 = s3;
    }

    @Override
    public String handleRequest(S3Event event, Context context) {
        context.getLogger().log("Received event: " + event);

        try {
            context.getLogger().log("start");

            storeAllNhsScotData(context);

            storeRssNewsFeed(context);

            context.getLogger().log("end");
        }
        catch (SdkClientException | IOException e) {
            context.getLogger().log("Error: " + e + "\n");
            e.printStackTrace();
            return "Failure";
        }

        return "Success";
    }

    private void storeAllNhsScotData(Context context) throws IOException, ClientProtocolException {
        storeNhsScotData(context, OBJECTKEY_NHS_SCOT_DAILY_COUNCIL_AREAS,
                OBJECTKEY_NHS_SCOT_DAILY_COUNCIL_AREAS_LAST_MODIFIED, NHS_SCOT_DAILY_COUNCIL_AREAS_URL);
        storeNhsScotData(context, OBJECTKEY_NHS_SCOT_DAILY_HEALTH_BOARDS,
                OBJECTKEY_NHS_SCOT_DAILY_HEALTH_BOARDS_LAST_MODIFIED, NHS_SCOT_DAILY_HEALTH_BOARDS_URL);
        storeNhsScotData(context, OBJECTKEY_NHS_SCOT_TOTAL_COUNCIL_AREAS,
                OBJECTKEY_NHS_SCOT_TOTAL_COUNCIL_AREAS_LAST_MODIFIED, NHS_SCOT_TOTAL_COUNCIL_AREAS_URL);
        storeNhsScotData(context, OBJECTKEY_NHS_SCOT_TOTAL_HEALTH_BOARDS,
                OBJECTKEY_NHS_SCOT_TOTAL_HEALTH_BOARDS_LAST_MODIFIED, NHS_SCOT_TOTAL_HEALTH_BOARDS_URL);
    }

    private void storeNhsScotData(Context context, String objectKeyData, String objectKeyModificationDate,
            String retrievalUrl) throws IOException, ClientProtocolException {
        String modificationDate = getObject(context, objectKeyModificationDate);

        context.getLogger().log("Call request\n");
        HttpGet request = new HttpGet(retrievalUrl);
        if (modificationDate != null) {
            request.addHeader("If-Modified-Since", modificationDate);
        }

        CloseableHttpClient client = createHttpClient();
        try (CloseableHttpResponse response = client.execute(request)) {
            int statusCode = response.getStatusLine().getStatusCode();
            if (HttpStatus.SC_NOT_MODIFIED == statusCode) {
                context.getLogger().log("NHS data not updated - skipping\n");
                return;
            }
            if (HttpStatus.SC_OK != statusCode) {
                context.getLogger().log("NHS data error response: " + statusCode + "\n");
                return;
            }

            context.getLogger().log("Response received\n");
            Header lastModifiedHeader = response.getFirstHeader("Last-Modified");
            String newModificationDate = null;
            if (lastModifiedHeader != null) {
                newModificationDate = lastModifiedHeader.getValue();
            }

            // Pipe straight to S3
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("text/plain");

            HttpEntity entity = response.getEntity();
            if (entity.getContentLength() > 0) {
                metadata.setContentLength(entity.getContentLength());
            }

            AccessControlList acl = new AccessControlList();
            acl.grantPermission(GroupGrantee.AllUsers, Permission.Read);

            s3.putObject(new PutObjectRequest(BUCKET_NAME, objectKeyData, entity.getContent(), metadata)
                    .withAccessControlList(acl));

            context.getLogger().log("Response stored in S3 at " + objectKeyData + "\n");

            if (newModificationDate != null) {
                storeObject(context, newModificationDate, objectKeyModificationDate);
                context.getLogger().log("Last updated stored in S3 at " + objectKeyModificationDate + "\n");
            }
        }

    }

    // Replaced in unit tests
    CloseableHttpClient createHttpClient() {
        return HttpClients.createDefault();
    }

    private void storeRssNewsFeed(Context context) throws UnsupportedOperationException, IOException {
        getAndStoreObject(context, new HttpGet(RSS_NEWS_FEED_URL), OBJECTKEY_RSS_NEWS_FEED);
    }

    private void getAndStoreObject(Context context, HttpUriRequest request, String targetObjectKeyName)
            throws UnsupportedOperationException, IOException {
        context.getLogger().log("Call request\n");

        CloseableHttpClient client = createHttpClient();
        try (CloseableHttpResponse response = client.execute(request)) {
            context.getLogger().log("Response received\n");

            // Pipe straight to S3
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("text/plain");

            HttpEntity entity = response.getEntity();
            if (entity.getContentLength() > 0) {
                metadata.setContentLength(entity.getContentLength());
            }

            AccessControlList acl = new AccessControlList();
            acl.grantPermission(GroupGrantee.AllUsers, Permission.Read);

            s3.putObject(new PutObjectRequest(BUCKET_NAME, targetObjectKeyName, entity.getContent(), metadata)
                    .withAccessControlList(acl));
        }

        context.getLogger().log("Response stored in S3 at " + targetObjectKeyName + "\n");
    }

    private void storeObject(Context context, String text, String objectKeyName) throws UnsupportedOperationException {

        byte[] textBytes = text.getBytes(StandardCharsets.UTF_8);
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(textBytes.length);
        metadata.setContentType("text/plain");

        AccessControlList acl = new AccessControlList();
        acl.grantPermission(GroupGrantee.AllUsers, Permission.Read);

        s3.putObject(new PutObjectRequest(BUCKET_NAME, objectKeyName, new ByteArrayInputStream(textBytes), metadata)
                .withAccessControlList(acl));

        context.getLogger().log("Object stored in S3 at " + objectKeyName + "\n");
    }

    private String getObject(Context context, String objectKeyName)
            throws UnsupportedOperationException, AmazonServiceException, SdkClientException, IOException {
        if (!s3.doesObjectExist(BUCKET_NAME, objectKeyName)) {
            context.getLogger().log("Object not found in S3 at " + objectKeyName + "\n");
            return null;
        }

        try (S3Object storedDatesModified = s3.getObject(BUCKET_NAME, objectKeyName)) {
            context.getLogger().log("Object retrieved from in S3 at " + objectKeyName + "\n");
            InputStream contentStream = storedDatesModified.getObjectContent();
            return new BufferedReader(new InputStreamReader(contentStream, StandardCharsets.UTF_8)).lines()
                    .collect(Collectors.joining("\n"));
        }
    }

    private static final String OBJECT_FOLDER = "data/";

    private final static String NHS_SCOT_URL_PREFIX = "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/";
    private final static String NHS_SCOT_DAILY_HEALTH_BOARDS_URL = NHS_SCOT_URL_PREFIX
            + "2dd8534b-0a6f-4744-9253-9565d62f96c2/download";
    private final static String NHS_SCOT_DAILY_COUNCIL_AREAS_URL = NHS_SCOT_URL_PREFIX
            + "427f9a25-db22-4014-a3bc-893b68243055/download";
    private final static String NHS_SCOT_TOTAL_HEALTH_BOARDS_URL = NHS_SCOT_URL_PREFIX
            + "7fad90e5-6f19-455b-bc07-694a22f8d5dc/download";
    private final static String NHS_SCOT_TOTAL_COUNCIL_AREAS_URL = NHS_SCOT_URL_PREFIX
            + "e8454cf0-1152-4bcb-b9da-4343f625dfef/download";
    
    private final static String OBJECTKEY_NHS_SCOT_DAILY_HEALTH_BOARDS_LAST_MODIFIED = OBJECT_FOLDER
            + "nhsDailyHealthBoardLastModified.txt";
    private final static String OBJECTKEY_NHS_SCOT_DAILY_COUNCIL_AREAS_LAST_MODIFIED = OBJECT_FOLDER
            + "nhsDailyCouncilAreaLastModified.txt";
    private final static String OBJECTKEY_NHS_SCOT_TOTAL_HEALTH_BOARDS_LAST_MODIFIED = OBJECT_FOLDER
            + "nhsTotalHealthBoardLastModified.txt";
    private final static String OBJECTKEY_NHS_SCOT_TOTAL_COUNCIL_AREAS_LAST_MODIFIED = OBJECT_FOLDER
            + "nhsTotalCouncilAreaLastModified.txt";

    private final static String OBJECTKEY_NHS_SCOT_DAILY_HEALTH_BOARDS = OBJECT_FOLDER + "dailyHealthBoards.csv";
    private final static String OBJECTKEY_NHS_SCOT_DAILY_COUNCIL_AREAS = OBJECT_FOLDER + "dailyCouncilAreas.csv";
    private final static String OBJECTKEY_NHS_SCOT_TOTAL_HEALTH_BOARDS = OBJECT_FOLDER
            + "currentTotalsHealthBoards.csv";
    private final static String OBJECTKEY_NHS_SCOT_TOTAL_COUNCIL_AREAS = OBJECT_FOLDER
            + "currentTotalsCouncilAreas.csv";

    private static final String BUCKET_NAME = "dashboard.aws.scottishtecharmy.org";

    private static final String RSS_NEWS_FEED_URL = "https://news.gov.scot/feed/rss";
    private static final String OBJECTKEY_RSS_NEWS_FEED = OBJECT_FOLDER + "newsScotGovRss.xml";

}