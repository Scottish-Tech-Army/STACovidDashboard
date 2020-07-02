ui <- fluidPage(
  theme = shinytheme("flatly"),

  navbarPage(
    # Page title
    # Displayed to the left of the navigation bar
    title = div(img(
      src = "tt_sq.png",
      height = "40px"
    ),
    HTML(paste0(
      "<a href=", shQuote(paste0("https://www.scottishtecharmy.org/")), target="_blank", ">",
      img(
        src = "sta.png",
        height = "40px"
      ), "</a>"
    )),
    style = "position: relative; top: -10px"
    ),

    windowTitle = "Tidyverse Troopers",


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
            "Date:",
            min = min(management$date_code),
            max = max(management$date_code),
            value = max(management$date_code)
          )
        ),

        column(
          4,
          selectInput(
            "data",
            label = "Data type:",
            choices = list(
              "COVID-19 positive cases" = "Testing - Cumulative people tested for COVID-19 - Positive",
              "COVID-19 patients in ICU - Total",
              "COVID-19 patients in hospital - Suspected",
              "COVID-19 patients in hospital - Confirmed"
            ),
            selected = "Testing - Cumulative people tested for COVID-19 - Positive"
          ),
        ),
        column(
          4,
          textOutput("note"),
          br(),

          tags$a(href = "https://statistics.gov.scot/data/coronavirus-covid-19-management-information", target="_blank", "Data Source")
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
      ),
    
    
  ),

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
            choices = local_authorities,
            selected = local_authorities
          )
        ),



        mainPanel(
          width = 9,
          tabsetPanel(
            type = "tabs",
            tabPanel(
              "Deaths",
              h4("Total COVID 19 related deaths to date"),
              # column(6,
              leafletOutput("scot_covid_plot", width = 900, height = 500)
              %>% withSpinner(color = "#0dc5c1"),
              tags$a(href = "https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/general-publications/weekly-and-monthly-data-on-births-and-deaths/deaths-involving-coronavirus-covid-19-in-scotland/archive", target="_blank", "Data Source"),
              br(),
              # column(6,
              "Note: Some locations are named IZ followed by a number, please refer",
              tags$a(href = "https://www2.gov.scot/Topics/Statistics/sns/SNSRef/DZresponseplan", target="_blank", "here for more information.")
            ),

            tabPanel(
              "Cardiovascular Prescriptions",
              h4("Number of Cardiovascular Prescriptions in Scotland"),
              plotOutput("prescriptions"),
              tags$a(href = "https://scotland.shinyapps.io/phs-covid-wider-impact/", target="_blank", "Data Source")
            )

           
          )
        ) # main panel
      )# sidebar
    ), # close local authorities
    tabPanel(
      title = "About Us",

      # App title
      titlePanel(div(img(
        src = "tt_text.jpg",
        width = "100%"
      )
      )
      ),


      fluidRow(
        column(1),
        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/rhiannon-batstone-076191120", target="_blank",
            img(
              src = "rb.jpg",
              width = "85%"
            ),
          ),
          h3("Rhi Batstone")
        ),


        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/richard--clark", target="_blank",
            img(
              src = "rc.jpg",
              width = "85%"
            )
          ),
          h3("Ric Clark")
        ),

        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/jonathancylau", target="_blank",
            img(
              src = "jl.jpg",
              width = "85%"
            )
          ),
          h3("Jonathan Lau")
        ),

        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/euan-robertson-5845582", target="_blank",
            img(
              src = "er.jpg",
              width = "85%"
            )
          ),
          h3("Euan Robertson")
        ),

        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/alstev", target="_blank",
            img(
              src = "as.jpg",
              width = "85%"
            )
          ),
          h3("Allan Stevenson")
        ),

        column(1)
        ) # about us
      )#about us
  ) # Nav bar
) #fluid Row
