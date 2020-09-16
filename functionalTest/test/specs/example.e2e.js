const dashboard = require('../pageobjects/dashboard.page');


describe('Covid-19 Dashboard', () => {
    xit('should have correct title', () => {
        dashboard.open();
        browser.pause(1000);
        expect(browser).toHaveTitle('Covid-19 Dashboard');
    });

    xit('should display Logo', () => {
        dashboard.open();
        browser.pause(1000);
        expect(dashboard.imgLogo).toBeDisplayed();
    });

    xit('should display correct heading title', () => {
        dashboard.open();
        expect(dashboard.headingTitle).toHaveTextContaining('Scottish COVID-19 Statistics');
    });

    xit('should display correct current phase', () => {
        dashboard.open();
        expect(dashboard.currentPhase).toHaveTextContaining('Phase 3');
    });

    xit('Health Board button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.healthBoard).toBeClickable();
    });

    xit('council Areas button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.councilAreas).toBeClickable();
    });

    it('Cases button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.cases).toBeClickable();
    });

    it('Deaths button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.deaths).toBeClickable();
    });

    it('dailyCases button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.dailyCases).toBeClickable();
    });

    it('totalCases button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.totalCases).toBeClickable();
    });

    it('dailyDeaths button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.dailyDeaths).toBeClickable();
    });

    it('totalDeaths button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.totalDeaths).toBeClickable();
    });

    it('percentageCases button should be clickable', () => {
        dashboard.open();       
        expect(dashboard.percentageCases).toBeClickable();
    });


});


