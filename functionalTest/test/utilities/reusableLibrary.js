/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
class reusableLibrary{
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    validateTitle(title) {
        if (expect(browser).toHaveTitle(title)) {
            console.log('Page title validated and passed with value as :',title)
        }
        else
        {
            console.log('Page title validated failed against :',title)
        }
        
    }

}

export default new reusableLibrary();