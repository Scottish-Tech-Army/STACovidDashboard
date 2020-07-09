
server <- function(input, output, session) {


  # Create reactive dataset
  management_reactive <- reactive({
    read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/dailyHealthBoardsCasesAndPatients.csv")) %>%
      mutate(
        value = str_replace_all(value, "\\*", "0"),
        value = as.numeric(value),
        date = as.Date(date)
      )
  })

  observe({
    updateSliderInput(
      session,
      inputId = "date",
      min = min(management_reactive()$date),
      max = max(management_reactive()$date),
      value = max(management_reactive()$date)
    )
  })

  management_leaflet_reactive <- reactive({
    management_reactive() %>%
      filter(
        variable == input$data,
        date == input$date
      )
  })

  management_plotly_reactive <- reactive({
    management_reactive() %>%
      filter(
        variable == input$data,
        date <= input$date
      )
  })

  scotland_covid_reactive <- reactive({
    read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/scotland_covid.csv"))
  })

  observe({
    updateCheckboxGroupInput(
      session,
      inputId = "local_auth",
      choices = unique(scotland_covid_reactive()$local_authority),
      selected = unique(scotland_covid_reactive()$local_authority)
    )
  })

  cardio_prescriptions_reactive <- reactive({
    read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/cardio_prescriptions.csv")) %>%
      filter(area_name %in% input$local_auth)
  })
  ## ----------------------------------------------------------------
  ##                         Leaflet Plot                         --
  ## ----------------------------------------------------------------

  
  output$scot_plot <- renderLeaflet({
    
    scotland_count <- scotland %>%
      left_join(management_leaflet_reactive(), by = c("HBName" = "areaname"))
    
    pal <- if (input$data == "cumulativeTestedPositive") {
      colorBin(c(
        "#E0E0E0",
        "#FEF0D9",
        "#FDCC8A",
        "#FC8D59",
        "#E34A33",
        "#B30000"), 
        domain = scotland_count$value, 
        bins = c(0, 1, 10, 100, 1000, 3000, Inf))
      
    } else if (input$data == "hospitalCasesConfirmed") {
      colorBin(c(
        "#E0E0E0",
        "#FEF0D9",
        "#FDCC8A",
        "#FC8D59",
        "#E34A33",
        "#B30000"), 
        domain = scotland_count$value, 
        bins = c(0, 10, 20, 40, 60, 80, 100, Inf))
      
    } else if (input$data == "hospitalCasesSuspected") {
      colorBin(c(
        "#E0E0E0",
        "#FEF0D9",
        "#FDCC8A",
        "#FC8D59",
        "#E34A33",
        "#B30000"), 
        domain = scotland_count$value, 
        bins = c(0, 10, 20, 40, 60, 80, 100, Inf))
      
    } else if(input$data == "ICUCasesTotal") {
      colorBin(c(
        "#E0E0E0",
        "#FEF0D9",
        "#FDCC8A",
        "#FC8D59",
        "#E34A33",
        "#B30000"), 
        domain = scotland_count$value, 
        bins = c(0, 2, 4, 6, 8, 10, Inf))
    }

    # creates hover over labels
    labels <- sprintf(
      "<strong>%s</strong><br/>%g",
      scotland_count$HBName,
      scotland_count$value
    ) %>% lapply(htmltools::HTML)


    scotland_count %>%
      leaflet() %>%
      addTiles("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png") %>%
      addPolygons(
        fillColor = ~ pal(value),
        weight = 1,
        opacity = 0.5,
        color = "black",
        fillOpacity = 0.5,
        highlight = highlightOptions(
          weight = 1,
          color = "grey",
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
    ggplotly(
      management_plotly_reactive() %>%
        ggplot(aes(x = date, y = value, col = areaname)) +
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
      # theme(legend.position = 'none')
    ) %>%
      add_trace(colors = "Dark2")
  })


  ##################################################################
  ##                       Covid deaths map                       ##
  ##################################################################



  scotland_deaths_reactive <- reactive({
    scotland_deaths %>%
      filter(local_authority %in% input$local_auth)
  })

  output$scot_covid_plot <- renderLeaflet({
    pal2 <- colorBin(c(
      "#E0E0E0",
      "#FEF0D9",
      "#FDCC8A",
      "#FC8D59",
      "#E34A33",
      "#B30000"
    ), domain = scotland_deaths_reactive()$rate_per_100_000_population, bins = c(0, 1, 100, 300, 500, 800, Inf))

    # creates hover over labels

    labels2 <- sprintf(
      "<strong>%s</strong><br>%s<br>
        <strong>Death count: </strong>%g<br>
        <strong>Death rate: </strong>%g<br>
        <strong>Pop: </strong>%g<br>
        <strong>Tests: </strong>--<br> 
        <strong>Result wait time: </strong>--<br>
        <strong>Daily new cases: </strong>--<br>
        <strong>NHS 111 calls: </strong>--<br>",
      scotland_deaths_reactive()$Name,
      scotland_deaths_reactive()$local_authority,
      scotland_deaths_reactive()$number_of_deaths,
      scotland_deaths_reactive()$rate_per_100_000_population,
      scotland_deaths_reactive()$population_2018_based
    ) %>% lapply(htmltools::HTML)

    scotland_deaths_reactive() %>%
      leaflet() %>%
      addTiles("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png") %>%
      addPolygons(
        color = "#515151",
        weight = 1,
        smoothFactor = 0.5,
        opacity = 0.5,
        fillOpacity = 0.5,
        fillColor = ~ pal2(rate_per_100_000_population),
        highlightOptions = highlightOptions(
          color = "white",
          weight = 2,
          bringToFront = TRUE
        ),
        label = labels2,
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
        pal = pal2,
        values = ~rate_per_100_000_population,
        opacity = 0.7,
        title = "Death Rate",
        position = "topleft"
      )
  })

  ##################################################################
  ##                  plot for prescription meds                  ##
  ##################################################################

  output$prescriptions <- renderPlot({
    cardio_prescriptions_reactive() %>%
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
      session, "local_auth",
      choices = unique(scotland_covid_reactive()$local_authority),
      selected = if (input$bar) unique(scotland_covid_reactive()$local_authority)
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
