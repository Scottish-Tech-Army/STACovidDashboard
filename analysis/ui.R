
ui <- fluidPage(
  theme = "app.css",


  navbarPage(
    title = div(
      HTML(paste0(
      )),
      style = "position: relative; top: -10px"
    ),

    windowTitle = "Data STAr",


    #################################################################
    ##                        Health Boards                        ##
    #################################################################


    # Contains the MVP and a broad overview of the data
    tabPanel(
      title = "Health Boards",



      # App title
      titlePanel(h3("COVID-19 Management in Scotland")),


      fluidRow(
        class = "controls",
        # Sidebar with a slider input for date and selector for data

        column(
          4,
          sliderInput(
            "date",
            "Select Date:",
            min = as.Date("2020-03-07"),
            max = as.Date("2020-06-05"),
            value = as.Date("2020-06-05")
          )
        ),

        column(
          4,
          selectInput(
            "data",
            label = "Select Measure:",
            choices = list(
              "COVID-19 Positive cases" = "cumulativeTestedPositive",
              "COVID-19 Patients in ICU" = "ICUCasesTotal",
              "COVID-19 Patients in hospital - Suspected" = "hospitalCasesSuspected",
              "COVID-19 Patients in hospital - Confirmed" = "hospitalCasesConfirmed"
            ),
            selected = "cumulativeTestedPositive"
          ),
        ),
        column(
          4,
          textOutput("note"),
          br(),

          tags$a(href = "https://statistics.gov.scot/data/coronavirus-covid-19-management-information", target = "_blank", "Data Source")
        )
      ),



      # main body
      fluidRow(
        column(
          4,
          # textOutput("title1"),
          leafletOutput("scot_plot", height = 550) %>% withSpinner(color = "#0dc5c1")
        ),
        column(
          8,
          # textOutput("title2"),
          plotlyOutput("eg_plot", height = 550) %>% withSpinner(color = "#0dc5c1")
        )
      )

    ),


    #################################################################
    ##                      Local Authorities                      ##
    #################################################################



    tabPanel(
      title = "Local Authorities",

      # App title
      titlePanel("COVID-19 at a local level"),


      # Sidebar with a slider input for date and selector for data
      sidebarLayout(
        sidebarPanel(
          width = 3,
          h3("Local Authorities"),
          checkboxInput("bar", "All/None", value = T),
          checkboxGroupInput("local_auth",
            label = "Selector",
            choices = NULL,
            selected = NULL
          )
        ),



        mainPanel(
          width = 9,
          tabsetPanel(
            type = "tabs",
            tabPanel(
              "Deaths",
              h4("Death rates per 100,000 population: March through May"),
              # column(6,
              leafletOutput("scot_covid_plot", width = 500, height = 700)
              %>% withSpinner(color = "#0dc5c1"),
              tags$a(href = "https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/general-publications/weekly-and-monthly-data-on-births-and-deaths/deaths-involving-coronavirus-covid-19-in-scotland/archive", target = "_blank", "Data Source"),
              br(),
              # column(6,
              "Note: Some locations are named IZ followed by a number, please refer",
              tags$a(href = "https://www2.gov.scot/Topics/Statistics/sns/SNSRef/DZresponseplan", target = "_blank", "here for more information.")
            ),

            tabPanel(
              "Cardiovascular Prescriptions",
              h4("Number of Cardiovascular Prescriptions in Scotland"),
              plotOutput("prescriptions"),
              tags$a(href = "https://scotland.shinyapps.io/phs-covid-wider-impact/", target = "_blank", "Data Source")
            )
          )
        ) # main panel
      ) # sidebar
    ) # close local authorities

  ) # Nav bar
) # fluid Row
