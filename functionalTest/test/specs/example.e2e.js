import { open, imgLogo, headingTitle, currentPhase, healthBoard, councilAreas, cases, deaths, dailyCases, totalCases, dailyDeaths, totalDeaths, percentageCases } from '../pageobjects/dashboard.page';

describe('Covid-19 Dashboard', () => {
    it('should have correct title', () => {
        open();
        title = 'Scottish COVID-19 Statistics';
        expect(browser).toHaveTitle(title);        
    });

      it('should display Logo', () => {
          open();
          expect(imgLogo).toBeDisplayed();
          
      });
  
      xit('should display correct heading title', () => {
          open();
          expect(headingTitle).toHaveTextContaining('Scottish COVID-19 Statistics');
      });
  
      xit('should display correct current phase', () => {     
          open();
          expect(currentPhase).toHaveTextContaining('Phase 3');
      });
  
      it('Health Board button should be clickable', () => {
          open();       
          expect(healthBoard).toBeClickable();
      });
  
      it('council Areas button should be clickable', () => {
          open();       
          expect(councilAreas).toBeClickable();
      });
  
      it('Cases button should be clickable', () => {
          open();       
          expect(cases).toBeClickable();
      });
  
      it('Deaths button should be clickable', () => {
          open();       
          expect(deaths).toBeClickable();
      });
  
      it('dailyCases button should be clickable', () => {
          open();       
          expect(dailyCases).toBeClickable();
      });
  
      it('totalCases button should be clickable', () => {
          open();       
          expect(totalCases).toBeClickable();
      });
  
      it('dailyDeaths button should be clickable', () => {
          open();       
          expect(dailyDeaths).toBeClickable();
      });
  
      it('totalDeaths button should be clickable', () => {
          open();       
          expect(totalDeaths).toBeClickable();
      });
  
      it('percentageCases button should be clickable', () => {
          open();       
          expect(percentageCases).toBeClickable();
      });
});
