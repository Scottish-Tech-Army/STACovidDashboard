
ui <- fluidPage(
  theme = "app.css",


  navbarPage(
    # Displayed to the left of the navigation bar
    
    title = div(
      HTML(paste0(
        "<a href=", shQuote(paste0("https://www.scottishtecharmy.org/")),
        target = "_blank", ">",
        img(
          src = "sta.png",
          height = "40px"
        ), "</a>"
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
      ),

      fluidRow(
        class = "footer",
        fluidRow(
          align = "center",
          column(
            3,
            "Unless otherwise stated, this webpage contains public sector information licensed under",
            a("the Open Government Licence 3.0.", href = "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/")
          ),
          column(
            3,
            tags$a(
              href = "https://www.gov.scot/collections/coronavirus-covid-19-guidance/",
              tags$img(
                src = "ScottishGovernmentLogo.svg",
                title = "ScottishGovernmentLogo",
                width = "270",
                height = "50"
              ),
              target = "_blank"
            )
          ),
          column(
            3,
            tags$a(
              href = "https://www.scottishtecharmy.org/",
              tags$img(
                src = "STABanner.png",
                title = "STABanner",
                width = "270",
                height = "50"
              ),
              target = "_blank"
            )
          ),
          column(
            3,
            tags$a(
              href = "https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19",
              tags$img(
                src = "NHSInformLogo.png",
                title = "NHSInformLogo",
                width = "180",
                height = "83"
              ),
              target = "_blank"
            )
          )
        ),
        fluidRow(
          align = "center",
          "© 2020 Copyright:", a("ScottishTechArmy.org", href = "ScottishTechArmy.org")
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
      ),

      fluidRow(
        class = "footer",
        fluidRow(
          align = "center",
          column(
            3,
            "Unless otherwise stated, this webpage contains public sector information licensed under",
            a("the Open Government Licence 3.0.", href = "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/")
          ),
          column(
            3,
            tags$a(
              href = "https://www.gov.scot/collections/coronavirus-covid-19-guidance/",
              tags$img(
                src = "ScottishGovernmentLogo.svg",
                title = "ScottishGovernmentLogo",
                width = "270",
                height = "50"
              ),
              target = "_blank"
            )
          ),
          column(
            3,
            tags$a(
              href = "https://www.scottishtecharmy.org/",
              tags$img(
                src = "STABanner.png",
                title = "STABanner",
                width = "270",
                height = "50"
              ),
              target = "_blank"
            )
          ),
          column(
            3,
            tags$a(
              href = "https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19",
              tags$img(
                src = "NHSInformLogo.png",
                title = "NHSInformLogo",
                width = "180",
                height = "83"
              ),
              target = "_blank"
            )
          )
        ),
        fluidRow(
          align = "center",
          "© 2020 Copyright:", a("ScottishTechArmy.org", href = "ScottishTechArmy.org")
        )
      ) # sidebar
    ), # close local authorities


    ##################################################################
    ##                         About us tab                         ##
    ##################################################################


    tabPanel(
      title = "About Us",

      fluidRow(
        column(2),
        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/rhiannon-batstone-076191120", target = "_blank",
            img(
              src = "rb..png",
              width = "85%"
            ),
          ),
          h3("Rhi Batstone")
        ),


        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/richard--clark", target = "_blank",
            img(
              src = "rc.png",
              width = "85%"
            )
          ),
          h3("Ric Clark")
        ),
        
        
        column(2,
               align = "center",
               tags$a(
                 href = "https://www.linkedin.com/in/craig-climie", target = "_blank",
                 img(
                   src = "cc.png",
                   width = "85%"
                 )
               ),
               h3("Craig Climie")
        ),

        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/jonathancylau", target = "_blank",
            img(
              src = "jl.png",
              width = "85%"
            )
          ),
          h3("Jonathan Lau")
        ),
        column(2)
        ),
      
      fluidRow(
        column(3),

        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/colin-lyman", target = "_blank",
            img(
              src = "cl.png",
              width = "85%"
            )
          ),
          h3("Colin Lyman")
        ),

        column(2,
          align = "center",
          tags$a(
            href = "https://www.linkedin.com/in/cristina-perez-11229846", target = "_blank",
            img(
              src = "cp.png",
              width = "85%"
            )
          ),
          h3("Cristina Perez")
        ),
      
        column(2,
               align = "center",
               tags$a(
                 href = "https://www.linkedin.com/in/lukepritchardwoollett", target = "_blank",
                 img(
                   src = "lpw.png",
                   width = "85%"
                 ),
               ),
               h3("Luke Pritchard-Woollett")
        ),
        column(3)
      ),
      fluidRow(
        
        column(2),
        
        column(2,
               align = "center",
               tags$a(
                 href = "https://www.linkedin.com/in/euan-robertson-5845582", target = "_blank",
                 img(
                   src = "er.png",
                   width = "85%"
                 )
               ),
               h3("Euan Robertson")
        ),
        
        column(2,
               align = "center",
               tags$a(
                 href = "https://www.linkedin.com/in/alstev", target = "_blank",
                 img(
                   src = "as.png",
                   width = "85%"
                 )
               ),
               h3("Allan Stevenson")
        ),
        
        column(2,
               align = "center",
               tags$a(
                 href = "https://www.linkedin.com/in/donalstewart", target = "_blank",
                 img(
                   src = "ds.png",
                   width = "85%"
                 )
               ),
               h3("Donal Stewart")
        ),
        
        column(2,
               align = "center",
               tags$a(
                 href = "https://www.linkedin.com/in/rebeccastill1", target = "_blank",
                 img(
                   src = "bs.png",
                   width = "85%"
                 )
               ),
               h3("Becky Still")
        ),
        column(2)
      ),
      

      
      ##################################################################
      ##                            Footer                            ##
      ##################################################################
      
      
      
      fluidRow(
        class = "footer",
        fluidRow(
          align = "center",
          column(
            3,
            "Unless otherwise stated, this webpage contains public sector information licensed under",
            a("the Open Government Licence 3.0.", href = "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/")
          ),
          column(
            3,
            tags$a(
              href = "https://www.gov.scot/collections/coronavirus-covid-19-guidance/",
              tags$img(
                src = "ScottishGovernmentLogo.svg",
                title = "ScottishGovernmentLogo",
                width = "270",
                height = "50"
              ),
              target = "_blank"
            )
          ),
          column(
            3,
            tags$a(
              href = "https://www.scottishtecharmy.org/",
              tags$img(
                src = "STABanner.png",
                title = "STABanner",
                width = "270",
                height = "50"
              ),
              target = "_blank"
            )
          ),
          column(
            3,
            tags$a(
              href = "https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19",
              tags$img(
                src = "NHSInformLogo.png",
                title = "NHSInformLogo",
                width = "180",
                height = "83"
              ),
              target = "_blank"
            )
          )
        ),
        fluidRow(
          align = "center",
          "© 2020 Copyright:", a("ScottishTechArmy.org", href = "ScottishTechArmy.org")
        )
      ) # about us
    ) # about us
  ) # Nav bar
) # fluid Row
