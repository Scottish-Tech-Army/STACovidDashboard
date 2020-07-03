
##################################################################
##                            Global                            ##
##################################################################

cardio_prescriptions <- read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/cardio_prescriptions.csv"))
management <- read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/management_clean.csv"))

scotland_covid <- read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/scotland_covid.csv"))

local_authorities <- unique(scotland_covid$local_authority) %>% 
  sort()


#shape file and reducing the polygons to increase render speed
scotland <- st_read("clean_data/scotland.shp", quiet = TRUE) %>%
  ms_simplify(keep = 0.025)


##################################################################
##                          Server                              ##
##################################################################



server <- function(input, output, session) {
 
  
  # Create reactive dataset
  management_reactive <- reactive({
    
      management %>%
        filter(variable == input$data) %>%
        filter(date_code == input$date)
    
  })

  ## ----------------------------------------------------------------
  ##                         Leaflet Plot                         --
  ## ----------------------------------------------------------------

  output$scot_plot <- renderLeaflet({

    # Join counts onto bondary geographical shape data
    scotland_count <- scotland %>%
      left_join(management_reactive(), by = c("HBName" = "official_name"))

    # creates bins and palette for leaflet plot
    #bins <- seq(0, max(management_reactive()$total), length.out = 6)
    
    pal <- colorBin("plasma", domain = scotland_count$value, bins = 5)

    # creates hover over labels
    labels <- sprintf(
      "<strong>%s</strong><br/>%g",
      scotland_count$HBName,
      scotland_count$value
    ) %>% lapply(htmltools::HTML)


    scotland_count %>%
      leaflet() %>%
      addPolygons(
        fillColor = ~pal(value),
        weight = 2,
        opacity = 1,
        color = "white",
        dashArray = "3",
        fillOpacity = 0.5,
        highlight = highlightOptions(
          weight = 5,
          color = "#666",
          dashArray = "",
          fillOpacity = 0.7,
          bringToFront = TRUE
        ),
        label = labels,
        labelOptions = labelOptions(
          style = list(
            "font-weight" = "normal",
            padding = "3px 8px"
          ),
          textsize = "15px",
          direction = "auto"
        )
      ) %>%
      addLegend(
        pal = pal,
        values = ~value,
        opacity = 0.7,
        title = "Count",
        position = "topleft"
      )
  })

  ##################################################################
  ##                  plot for management values                  ##
  ##################################################################


  output$eg_plot <- renderPlotly({
    
    
    ggplotly(management %>%
      filter(variable == input$data) %>%
      filter(date_code <= input$date) %>%
      ggplot(aes(x = date_code, y = value, col = official_name
                 )) +
      geom_line() +
      scale_fill_viridis_b() +
      labs(
        x = "Date",
        y = "Count",
        col = "Region"
        ) +
        theme(
          legend.text = element_text(size = 5)
        ) +
      theme_classic() #+
      #theme(legend.position = 'none') 
      ) %>%
      add_trace(colors = "Dark2") 
    
  })
  
  
  output$scot_covid_plot <- renderLeaflet({ 
    
    
    # this needs to be reactive i think
    labels2 <- labels <- sprintf(
      "<strong>%s</strong><br/>%g",
      scotland_covid$Name,
      scotland_covid$number_of_deaths
    ) %>% lapply(htmltools::HTML)
    
    bins = c(0, 10, 20, max(scotland_covid$number_of_deaths))
    
    pal2 <- colorBin(c("#f1ed0e", "orange", "#FF0000"), 
                  domain = scotland_covid$number_of_deaths, 
                  bin = bins)
  
  scotland_covid %>%
    filter(local_authority %in% input$local_auth) %>% 
    leaflet() %>%
    addProviderTiles(
      providers$CartoDB.Positron
    ) %>%
    addCircleMarkers(lng = ~long,
                     lat = ~lat,
                     fillOpacity = 0.5,
                     stroke = F,
                     radius = ~population_2018_based/1000,
                     color = ~pal2(number_of_deaths),
                     popup = ~labels2
    ) %>% 
    addLegend(
      pal = pal2,
      values = ~number_of_deaths,
      opacity = 0.7,
      title = "Number of deaths",
      position = "topleft"
    )
  })
  
  ##################################################################
  ##                  plot for prescription meds                  ##
  ##################################################################
  
  output$prescriptions <- renderPlot({
    
   
  cardio_prescriptions %>% 
    filter(area_name %in% input$local_auth) %>% 
    group_by(week_ending) %>%
    mutate(avg = mean(variation)) %>% 
    ggplot(aes(x = week_ending, y = avg)) +
    geom_line() +
    theme_classic() +
    labs(
        x = "Date",
        y = "Number of Prescriptions"
      )
    
  })
  
  observe({
    updateCheckboxGroupInput(
      session, 'local_auth', choices = local_authorities,
      selected = if (input$bar) local_authorities
    )
  })
  
  
  output$title1 <- renderText({ 
    paste(input$data)
  })
  
  output$title2 <- renderText({ 
    paste(input$data)
  })
  
  
  output$note <- renderText({
    
    if (input$data == "Testing - Cumulative people tested for COVID-19 - Positive") {
      print("Note: Count is cumulative")
    } else {
      " "
    }
    
  }) 
  
}
