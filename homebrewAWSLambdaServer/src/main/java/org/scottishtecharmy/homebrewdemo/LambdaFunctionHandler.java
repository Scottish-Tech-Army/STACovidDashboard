package org.scottishtecharmy.homebrewdemo;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Calendar;
import java.util.stream.Collectors;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.mime.MultipartEntityBuilder;
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
            storeStatsGovData(context);

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

    private void storeStatsGovData(Context context) throws IOException, ClientProtocolException {
        String storedDates = getObject(context, OBJECTKEY_STATS_GOV_DATES_MODIFIED);
        String newDates = getStatsQuery(QUERY_STATS_GOV_DATES_MODIFIED, context);

        if (isDateModified(storedDates, newDates)) {

            storeStatsQuery(QUERY_WEEKLY_HEALTH_BOARDS_DEATHS, OBJECTKEY_WEEKLY_HEALTH_BOARDS_DEATHS, context);
            storeStatsQuery(QUERY_DAILY_SCOTTISH_CASES_AND_DEATHS, OBJECTKEY_DAILY_SCOTTISH_CASES_AND_DEATHS, context);
            storeStatsQuery(QUERY_WEEKLY_COUNCIL_AREAS_DEATHS, OBJECTKEY_WEEKLY_COUNCIL_AREAS_DEATHS, context);
            storeStatsQuery(QUERY_DAILY_HEALTH_BOARDS_CASES, OBJECTKEY_DAILY_HEALTH_BOARDS_CASES, context);
            storeStatsQuery(QUERY_DAILY_HEALTH_BOARDS_CASES_AND_PATIENTS,
                    OBJECTKEY_DAILY_HEALTH_BOARDS_CASES_AND_PATIENTS, context);

            String last2Years = getYearsDateValueClause();

            storeStatsQuery(QUERYTEMPLATE_ANNUAL_HEALTH_BOARDS_DEATHS.replace(LAST_2_YEARS, last2Years),
                    OBJECTKEY_ANNUAL_HEALTH_BOARDS_DEATHS, context);
            storeStatsQuery(QUERYTEMPLATE_ANNUAL_COUNCIL_AREAS_DEATHS.replace(LAST_2_YEARS, last2Years),
                    OBJECTKEY_ANNUAL_COUNCIL_AREAS_DEATHS, context);

            // Got everything else - store datesModified
            storeObject(context, newDates, OBJECTKEY_STATS_GOV_DATES_MODIFIED);
            context.getLogger().log("datesModified updated\n");
        }
        else {
            context.getLogger().log("datesModified not updated - skipping stats queries\n");
        }
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

    public void storeStatsQuery(String query, String targetObjectKeyName, Context context)
            throws ClientProtocolException, IOException {

        HttpPost httpPost = new HttpPost(SPARQL_URL);
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addTextBody("query", query);
        HttpEntity multipart = builder.build();
        httpPost.setEntity(multipart);

        getAndStoreObject(context, httpPost, targetObjectKeyName);
    }

    private String getStatsQuery(String query, Context context) throws ClientProtocolException, IOException {

        HttpPost httpPost = new HttpPost(SPARQL_URL);
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addTextBody("query", query);
        HttpEntity multipart = builder.build();
        httpPost.setEntity(multipart);

        context.getLogger().log("Call request\n");

        CloseableHttpClient client = createHttpClient();
        try (CloseableHttpResponse response = client.execute(httpPost)) {
            context.getLogger().log("Response received\n");

            // Pipe straight to S3
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("text/plain");

            HttpEntity entity = response.getEntity();
            InputStream contentStream = entity.getContent();
            return new BufferedReader(new InputStreamReader(contentStream, StandardCharsets.UTF_8)).lines()
                    .collect(Collectors.joining("\n"));
        }
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

    // Last 2 years
    private static String getYearsDateValueClause() {
        int thisYear = Calendar.getInstance().get(Calendar.YEAR);
        return singleYearLine(thisYear) + singleYearLine(thisYear - 1);
    }

    private static String singleYearLine(int year) {
        return "( <http://reference.data.gov.uk/id/year/" + year + "> \"" + year + "\" )";
    }

    boolean isDateModified(String oldModificationData, String newModificationData) {
        return newModificationData == null || newModificationData.isEmpty()
                || !newModificationData.equals(oldModificationData);
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

    private static final String SPARQL_URL = "https://statistics.gov.scot/sparql.csv";
    private static final String BUCKET_NAME = "dashboard.aws.scottishtecharmy.org";

    private static final String OBJECTKEY_STATS_GOV_DATES_MODIFIED = OBJECT_FOLDER + "datesmodified.csv";
    private static final String OBJECTKEY_WEEKLY_HEALTH_BOARDS_DEATHS = OBJECT_FOLDER + "weeklyHealthBoardsDeaths.csv";
    private static final String OBJECTKEY_ANNUAL_HEALTH_BOARDS_DEATHS = OBJECT_FOLDER + "annualHealthBoardsDeaths.csv";
    private static final String OBJECTKEY_DAILY_SCOTTISH_CASES_AND_DEATHS = OBJECT_FOLDER
            + "dailyScottishCasesAndDeaths.csv";
    private static final String OBJECTKEY_WEEKLY_COUNCIL_AREAS_DEATHS = OBJECT_FOLDER + "weeklyCouncilAreasDeaths.csv";
    private static final String OBJECTKEY_ANNUAL_COUNCIL_AREAS_DEATHS = OBJECT_FOLDER + "annualCouncilAreasDeaths.csv";
    private static final String OBJECTKEY_DAILY_HEALTH_BOARDS_CASES = OBJECT_FOLDER + "dailyHealthBoardsCases.csv";
    private static final String OBJECTKEY_DAILY_HEALTH_BOARDS_CASES_AND_PATIENTS = OBJECT_FOLDER
            + "analysis/dailyHealthBoardsCasesAndPatients.csv";

    private static final String RSS_NEWS_FEED_URL = "https://news.gov.scot/feed/rss";
    private static final String OBJECTKEY_RSS_NEWS_FEED = OBJECT_FOLDER + "newsScotGovRss.xml";

    private static final String LAST_2_YEARS = "__LAST_2_YEARS__";

    private static final String FRAGMENT_COMMON_PREFIXES = "PREFIX qb: <http://purl.org/linked-data/cube#>\n"
            + "PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>\n"
            + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";

    private static final String FRAGMENT_ALL_COVID_DEATHS = "?obs <http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/deaths-involving-coronavirus-covid-19> .\n"
            + "?obs <http://statistics.gov.scot/def/dimension/sex> <http://statistics.gov.scot/def/concept/sex/all>.\n"
            + "?obs <http://statistics.gov.scot/def/dimension/age> <http://statistics.gov.scot/def/concept/age/all>.\n"
            + "?obs <http://statistics.gov.scot/def/dimension/causeOfDeath> <http://statistics.gov.scot/def/concept/cause-of-death/covid-19-related>.\n"
            + "?obs <http://statistics.gov.scot/def/dimension/locationOfDeath> <http://statistics.gov.scot/def/concept/location-of-death/all>.\n";

    private static final String QUERY_WEEKLY_HEALTH_BOARDS_DEATHS = FRAGMENT_COMMON_PREFIXES + "\n"
            + "SELECT ?date ?areaname ?count WHERE {\n" + FRAGMENT_ALL_COVID_DEATHS
            + "?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .\n"
            + "?obs dim:refArea ?areauri .\n"
            + "?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .\n"
            + "?areauri rdfs:label ?areaname.\n" + "?obs dim:refPeriod ?perioduri .\n" + "?perioduri rdfs:label ?date\n"
            + "FILTER regex(?date, \"^w\")\n" + "}";

    private static final String QUERYTEMPLATE_ANNUAL_HEALTH_BOARDS_DEATHS = FRAGMENT_COMMON_PREFIXES
            + "SELECT ?date ?areaname ?count WHERE {\n" + "  VALUES (?perioduri ?date) { " + LAST_2_YEARS + " }\n"
            + FRAGMENT_ALL_COVID_DEATHS + "?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .\n"
            + "?obs dim:refArea ?areauri .\n" + "?obs dim:refPeriod ?perioduri .\n"
            + "?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .\n"
            + "?areauri rdfs:label ?areaname\n" + "}";

    private static final String QUERY_DAILY_SCOTTISH_CASES_AND_DEATHS = FRAGMENT_COMMON_PREFIXES
            + "SELECT ?date ?shortValue ?count WHERE {\n" + "   VALUES (?value ?shortValue) {\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> \"positiveCases\" )\n"
            + "( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-total> \"totalCases\" )\n"
            + "( <http://statistics.gov.scot/def/concept/variable/number-of-covid-19-confirmed-deaths-registered-to-date> \"totalDeaths\" )\n"
            + "  }\n"
            + "  ?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .\n"
            + "  ?obs dim:refArea <http://statistics.gov.scot/id/statistical-geography/S92000003> .\n"
            + "  ?obs <http://statistics.gov.scot/def/dimension/variable> ?value .\n"
            + "  ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .\n"
            + "  ?obs dim:refPeriod ?perioduri .\n" + "  ?perioduri rdfs:label ?date\n" + "}";

    private static final String QUERY_WEEKLY_COUNCIL_AREAS_DEATHS = FRAGMENT_COMMON_PREFIXES
            + "SELECT ?date ?areaname ?count WHERE {\n" + FRAGMENT_ALL_COVID_DEATHS
            + "?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .\n"
            + "?obs dim:refArea ?areauri .\n" + "?obs dim:refPeriod ?perioduri .\n"
            + "?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/council-areas> .\n"
            + "?areauri rdfs:label ?areaname.\n" + "?perioduri rdfs:label ?date\n" + "FILTER regex(?date, \"^w\")\n"
            + "}";

    private static final String QUERYTEMPLATE_ANNUAL_COUNCIL_AREAS_DEATHS = FRAGMENT_COMMON_PREFIXES
            + "SELECT ?date ?areaname ?count WHERE {\n" + "  VALUES (?perioduri ?date) { " + LAST_2_YEARS + " }\n"
            + FRAGMENT_ALL_COVID_DEATHS + "?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .\n"
            + "?obs dim:refArea ?areauri .\n" + "?obs dim:refPeriod ?perioduri .\n"
            + "?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/council-areas> .\n"
            + "?areauri rdfs:label ?areaname\n" + "}";

    private static final String QUERY_DAILY_HEALTH_BOARDS_CASES = FRAGMENT_COMMON_PREFIXES
            + "SELECT ?date ?areaname ?count WHERE {\n"
            + "?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .\n"
            + "?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .\n"
            + "?obs <http://statistics.gov.scot/def/dimension/variable> <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> .\n"
            + "?obs dim:refArea ?areauri .\n"
            + "?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .\n"
            + "?areauri rdfs:label ?areaname.\n" + "?obs dim:refPeriod ?perioduri .\n" + "?perioduri rdfs:label ?date\n"
            + "}";

    private static final String QUERY_DAILY_HEALTH_BOARDS_CASES_AND_PATIENTS = FRAGMENT_COMMON_PREFIXES
            + "SELECT ?date ?value ?variable ?areaname \n" + "WHERE {\n" + "   VALUES (?fullVariable ?variable) {\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> \"cumulativeTestedPositive\" )\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/covid-19-patients-in-hospital-confirmed> \"hospitalCasesConfirmed\" )\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/covid-19-patients-in-hospital-suspected> \"hospitalCasesSuspected\" )\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/covid-19-patients-in-icu-total> \"ICUCasesTotal\" )\n"
            + "  }\n"
            + "  ?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .\n"
            + "  ?obs <http://statistics.gov.scot/def/dimension/variable> ?fullVariable .\n"
            + "  ?obs <http://statistics.gov.scot/def/measure-properties/count> ?value .\n"
            + "  ?obs dim:refArea ?areauri .\n"
            + "  ?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards>.\n"
            + "  ?areauri rdfs:label ?areaname.\n" + "  ?obs dim:refPeriod ?perioduri .\n"
            + "  ?perioduri rdfs:label ?date\n" + "}";

    private static final String QUERY_STATS_GOV_DATES_MODIFIED = "SELECT ?datagraph ?dateModified\n" + "WHERE {\n"
            + "VALUES (?datagraph) {\n"
            + "( <http://statistics.gov.scot/graph/deaths-involving-coronavirus-covid-19> )\n"
            + "( <http://statistics.gov.scot/graph/coronavirus-covid-19-management-information> )\n" + "}\n"
            + "?obs <http://publishmydata.com/def/dataset#graph> ?datagraph .\n"
            + "?obs <http://purl.org/dc/terms/modified> ?dateModified\n" + "}";

}