package org.scottishtecharmy.homebrewdemo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.stream.Collectors;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
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

public class LambdaFunctionHandler implements RequestHandler<S3Event, String> {

    private static final String BUCKET_NAME = "sta-homebrew-iteam";

    
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
            storeStatsQuery(QUERY_WEEKLY_HEALTH_BOARDS_DEATHS, OBJECTKEY_WEEKLY_HEALTH_BOARDS_DEATHS, context);
            storeStatsQuery(QUERY_DAILY_SCOTTISH_CASES_AND_DEATHS, OBJECTKEY_DAILY_SCOTTISH_CASES_AND_DEATHS, context);
            storeStatsQuery(QUERY_WEEKLY_COUNCIL_AREAS_DEATHS, OBJECTKEY_WEEKLY_COUNCIL_AREAS_DEATHS, context);
            storeStatsQuery(QUERY_DAILY_HEALTH_BOARDS_CASES, OBJECTKEY_DAILY_HEALTH_BOARDS_CASES, context);

            String last4Days = getDaysDateValueClause();
            String last2Years = getYearsDateValueClause();

            storeStatsQuery(QUERYTEMPLATE_SUMMARY_COUNTS.replace(LAST_4_DAYS, last4Days), OBJECTKEY_SUMMARY_COUNTS,
                    context);
            storeStatsQuery(QUERYTEMPLATE_TOTAL_HEALTH_BOARDS_CASES.replace(LAST_4_DAYS, last4Days),
                    OBJECTKEY_TOTAL_HEALTH_BOARDS_CASES, context);
            storeStatsQuery(QUERYTEMPLATE_ANNUAL_HEALTH_BOARDS_DEATHS.replace(LAST_2_YEARS, last2Years),
                    OBJECTKEY_ANNUAL_HEALTH_BOARDS_DEATHS, context);
            storeStatsQuery(QUERYTEMPLATE_ANNUAL_COUNCIL_AREAS_DEATHS.replace(LAST_2_YEARS, last2Years),
                    OBJECTKEY_ANNUAL_COUNCIL_AREAS_DEATHS, context);
            context.getLogger().log("end");
        }
        catch (Exception e) {
            e.printStackTrace();
            context.getLogger().log("Failed to query");
            return "Failure";
        }

        return "Success";
    }

    // Replaced in unit tests
    CloseableHttpClient createHttpClient() {
        return HttpClients.createDefault();
    }
    
    // public void storeStatsQuery(String query, S3Entity targetLocation) throws
    // ClientProtocolException, IOException {
    public void storeStatsQuery(String query, String targetObjectKeyName, Context context)
            throws ClientProtocolException, IOException {

        HttpPost httpPost = new HttpPost("https://statistics.gov.scot/sparql.csv");
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addTextBody("query", query);
        HttpEntity multipart = builder.build();
        httpPost.setEntity(multipart);

        String text = null;
        context.getLogger().log("Call request");

        CloseableHttpClient client = createHttpClient();
        try (CloseableHttpResponse response = client.execute(httpPost)) {
            context.getLogger().log("Response received");

            HttpEntity entity = response.getEntity();
            InputStream contentStream = entity.getContent();
            text = new BufferedReader(new InputStreamReader(contentStream, StandardCharsets.UTF_8)).lines()
                    .collect(Collectors.joining("\n"));
            context.getLogger().log("Response entity retrieved");
        }

        // Output to file on S3
        try {
            s3.putObject(BUCKET_NAME, targetObjectKeyName, text);
            context.getLogger().log("Response stored in S3 at " + targetObjectKeyName);
        }
        catch (AmazonServiceException e) {
            // The call was transmitted successfully, but Amazon S3 couldn't
            // process
            // it, so it returned an error response.
            e.printStackTrace();
        }
        catch (SdkClientException e) {
            // Amazon S3 couldn't be contacted for a response, or the client
            // couldn't parse the response from Amazon S3.
            e.printStackTrace();
        }
    }

    // Last 2 years
    private static String getYearsDateValueClause() {
        int thisYear = Calendar.getInstance().get(Calendar.YEAR);
        return singleYearLine(thisYear) + singleYearLine(thisYear - 1);
    }

    // Last 4 days
    private static String getDaysDateValueClause() {
        Instant today = Instant.now();
        Instant yesterday = today.minus(1, ChronoUnit.DAYS);
        Instant dayBefore = today.minus(2, ChronoUnit.DAYS);
        Instant twoDaysBefore = today.minus(3, ChronoUnit.DAYS);

        return singleDayLine(today) + singleDayLine(yesterday) + singleDayLine(dayBefore)
                + singleDayLine(twoDaysBefore);
    }

    private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private static String singleDayLine(Instant date) {
        String dateString = simpleDateFormat.format(new Date(date.toEpochMilli()));
        return "( <http://reference.data.gov.uk/id/day/" + dateString + "> \"" + dateString + "\" )";
    }

    private static String singleYearLine(int year) {
        return "( <http://reference.data.gov.uk/id/year/" + year + "> \"" + year + "\" )";
    }

    private static final String OBJECT_FOLDER = "data/";

    private static final String OBJECTKEY_SUMMARY_COUNTS = OBJECT_FOLDER + "summaryCounts.csv";
    private static final String OBJECTKEY_WEEKLY_HEALTH_BOARDS_DEATHS = OBJECT_FOLDER + "weeklyHealthBoardsDeaths.csv";
    private static final String OBJECTKEY_ANNUAL_HEALTH_BOARDS_DEATHS = OBJECT_FOLDER + "annualHealthBoardsDeaths.csv";
    private static final String OBJECTKEY_DAILY_SCOTTISH_CASES_AND_DEATHS = OBJECT_FOLDER
            + "dailyScottishCasesAndDeaths.csv";
    private static final String OBJECTKEY_WEEKLY_COUNCIL_AREAS_DEATHS = OBJECT_FOLDER + "weeklyCouncilAreasDeaths.csv";
    private static final String OBJECTKEY_ANNUAL_COUNCIL_AREAS_DEATHS = OBJECT_FOLDER + "annualCouncilAreasDeaths.csv";
    private static final String OBJECTKEY_DAILY_HEALTH_BOARDS_CASES = OBJECT_FOLDER + "dailyHealthBoardsCases.csv";
    private static final String OBJECTKEY_TOTAL_HEALTH_BOARDS_CASES = OBJECT_FOLDER + "totalHealthBoardsCases.csv";

    // // Last 4 days
    // + "( <http://reference.data.gov.uk/id/day/2020-07-01> \"2020-07-01\" )"
    // + "( <http://reference.data.gov.uk/id/day/2020-06-30> \"2020-06-30\" )"
    // + "( <http://reference.data.gov.uk/id/day/2020-06-29> \"2020-06-29\" )"
    // + "( <http://reference.data.gov.uk/id/day/2020-06-28> \"2020-06-28\" )"
    //
    // // Last 2 years
    // + "( <http://reference.data.gov.uk/id/year/2020> \"2020\" )"
    // + "( <http://reference.data.gov.uk/id/year/2019> \"2019\" )"

    private static final String LAST_4_DAYS = "__LAST_4_DAYS__";
    private static final String LAST_2_YEARS = "__LAST_2_YEARS__";

    private static final String FRAGMENT_COMMON_PREFIXES = "PREFIX qb: <http://purl.org/linked-data/cube#>\n"
            + "PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>\n"
            + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";

    private static final String FRAGMENT_ALL_COVID_DEATHS = "?obs <http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/deaths-involving-coronavirus-covid-19> .\n"
            + "?obs <http://statistics.gov.scot/def/dimension/sex> <http://statistics.gov.scot/def/concept/sex/all>.\n"
            + "?obs <http://statistics.gov.scot/def/dimension/age> <http://statistics.gov.scot/def/concept/age/all>.\n"
            + "?obs <http://statistics.gov.scot/def/dimension/causeofdeath> <http://statistics.gov.scot/def/concept/causeofdeath/covid-19-related>.\n"
            + "?obs <http://statistics.gov.scot/def/dimension/locationofdeath> <http://statistics.gov.scot/def/concept/locationofdeath/all>.\n";

    private static final String QUERYTEMPLATE_SUMMARY_COUNTS = FRAGMENT_COMMON_PREFIXES
            + "SELECT ?date ?shortValue ?count WHERE {\n" + "  VALUES (?value ?shortValue) {\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/testing-daily-people-found-positive> \"dailyPositiveTests\" )\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> \"cumulativePositiveTests\" )\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-total> \"cumulativeTotalTests\")\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/number-of-covid-19-confirmed-deaths-registered-to-date> \"cumulativeDeaths\" )\n"
            + "  }\n" + "  VALUES (?perioduri ?date) { " + LAST_4_DAYS + " }\n"
            + "  ?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .\n"
            + "  ?obs dim:refArea <http://statistics.gov.scot/id/statistical-geography/S92000003> .\n"
            + "  ?obs <http://statistics.gov.scot/def/dimension/variable> ?value .\n"
            + "  ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .\n"
            + "  ?obs dim:refPeriod ?perioduri\n" + "}";

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
            + "?obs <http://statistics.gov.scot/def/dimension/locationofdeath> <http://statistics.gov.scot/def/concept/locationofdeath/all>.\n"
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

    private static final String QUERYTEMPLATE_TOTAL_HEALTH_BOARDS_CASES = FRAGMENT_COMMON_PREFIXES
            + "SELECT ?date ?areaname ?count WHERE {\n" + "  VALUES (?value) {\n"
            + "    ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> )\n"
            + "   }\n" + "   VALUES (?perioduri ?date) { " + LAST_4_DAYS + " }\n"
            + "  ?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .\n"
            + "  ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .\n"
            + "  ?obs <http://statistics.gov.scot/def/dimension/variable> ?value .\n"
            + "?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .\n"
            + "  ?obs dim:refArea ?areauri .\n" + "  ?areauri rdfs:label ?areaname.\n"
            + "  ?obs dim:refPeriod ?perioduri .\n" + "}";

}