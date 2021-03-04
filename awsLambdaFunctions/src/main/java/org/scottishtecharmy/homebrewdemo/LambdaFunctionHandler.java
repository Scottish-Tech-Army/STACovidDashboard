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
            context.getLogger().log("\nstart\n");

            storeAllNhsScotData(context);

            context.getLogger().log("\nend\n");
        }
        catch (SdkClientException | IOException e) {
            context.getLogger().log("Error: " + e + "\n");
            e.printStackTrace();
            return "Failure";
        }

        return "Success";
    }

    private void storeAllNhsScotData(Context context) throws IOException, ClientProtocolException {
        for (String[] dataset : DATASETS) {
            String retrievalUrl = dataset[0];
            String objectKeyData = OBJECT_FOLDER + dataset[1] + ".csv";
            String objectKeyModificationDate = OBJECT_FOLDER + dataset[1] + "LastModified.txt";
            storeNhsScotData(context, objectKeyData, objectKeyModificationDate, retrievalUrl);
        }
    }

    private void storeNhsScotData(Context context, String objectKeyData, String objectKeyModificationDate,
            String retrievalUrl) throws IOException, ClientProtocolException {
        String modificationDate = getObject(context, objectKeyModificationDate);

        context.getLogger().log("Call request\n");
        HttpGet request = new HttpGet(retrievalUrl);
        if (modificationDate != null) {
            request.addHeader("If-Modified-Since", modificationDate);
        }

        try (CloseableHttpClient client = createHttpClient();
                CloseableHttpResponse response = client.execute(request)) {
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

            if (newModificationDate != null && newModificationDate.equals(modificationDate)) {
                context.getLogger().log("NHS request not respecting If-Modified-Since - skipping\n");
                return;
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

    @SuppressWarnings("resource")
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

    private final static String NHS_SCOT_URL_PREFIX = "https://www.opendata.nhs.scot/dataset/";
    private final static String NHS_SCOT_DAILY_URL_PREFIX = NHS_SCOT_URL_PREFIX
            + "b318bddf-a4dc-4262-971f-0ba329e09b87/resource/";

    private final static String DAILY_HEALTH_BOARDS_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "2dd8534b-0a6f-4744-9253-9565d62f96c2/download";
    private final static String DAILY_COUNCIL_AREAS_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "427f9a25-db22-4014-a3bc-893b68243055/download";
    private final static String TOTAL_HEALTH_BOARDS_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "7fad90e5-6f19-455b-bc07-694a22f8d5dc/download";
    private final static String TOTAL_COUNCIL_AREAS_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "e8454cf0-1152-4bcb-b9da-4343f625dfef/download";
    private final static String TESTS_HEALTH_BOARDS_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "8da654cd-293b-4286-96a4-b3ece86225f0/download";
    private final static String TESTS_COUNCIL_AREAS_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "3349540e-dc63-4d6d-a78b-00387b9aca50/download";
    private final static String DAILY_AND_CUMULATIVE_TESTS_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "287fc645-4352-4477-9c8c-55bc054b7e76/download";
    private final static String WEEKLY_TRENDS_BY_NEIGHBOURHOOD_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "8906de12-f413-4b3f-95a0-11ed15e61773/download";
    private final static String DAILY_CASE_TRENDS_BY_AGE_AND_SEX_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "9393bd66-5012-4f01-9bc5-e7a10accacf4/download";
    private final static String DAILY_CASE_TRENDS_BY_DEPRIVATION_URL = NHS_SCOT_DAILY_URL_PREFIX
            + "a38a4c21-7c75-4ecd-a511-3f83e0e8f0c3/download";

    private final static String HOSPITAL_ONSET_URL = NHS_SCOT_URL_PREFIX
            + "d67b13ef-73a4-482d-b5df-d39d777540fd/resource/5acbccb1-e9d6-4ab2-a7ac-f3e4d378e7ec/download";

    private final static String[][] DATASETS = {
            { DAILY_COUNCIL_AREAS_URL, "dailyCouncilAreas" },
            { DAILY_HEALTH_BOARDS_URL, "dailyHealthBoards" },
            { TOTAL_COUNCIL_AREAS_URL, "currentTotalsCouncilAreas" },
            { TOTAL_HEALTH_BOARDS_URL, "currentTotalsHealthBoards" },
            { TESTS_COUNCIL_AREAS_URL, "testsCouncilAreas" },
            { TESTS_HEALTH_BOARDS_URL, "testsHealthBoards" },
            { DAILY_AND_CUMULATIVE_TESTS_URL, "dailyAndCumulativeTests" },
            { WEEKLY_TRENDS_BY_NEIGHBOURHOOD_URL, "weeklyTrendsByNeighbourhood" },
            { DAILY_CASE_TRENDS_BY_AGE_AND_SEX_URL, "dailyCaseTrendsByAgeAndSex" },
            { DAILY_CASE_TRENDS_BY_DEPRIVATION_URL, "dailyCaseTrendsByDeprivation" },
            { HOSPITAL_ONSET_URL, "hospitalOnset" }, };

    private static final String BUCKET_NAME = "dashboard.aws.scottishtecharmy.org";
}