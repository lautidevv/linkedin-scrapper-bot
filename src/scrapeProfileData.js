import dotenv from 'dotenv';
dotenv.config();

import puppeteer from 'puppeteer';

async function scrapeProfileData(page) {
  var profile = {
    url: page.url(),
  }
  try {
    await page.waitForSelector(
      ".pv-text-details__about-this-profile-entrypoint"
    );

    const fullName = await page.evaluate(() => {
      const titleElement = document.querySelector(
        ".pv-text-details__about-this-profile-entrypoint"
      );
      const h1Element = titleElement.querySelector("h1");
      
      if(!h1Element) {
        return null
      }
      return h1Element.textContent.trim();
    });

    if(fullName){
      profile.fullName = fullName;
  
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0];

      profile.firstName = firstName;
      if(nameParts.length > 1){
        const lastName = nameParts.slice(1).join(" ");
        profile.lastName = lastName;
      }
    }

    const summary = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h2>span[aria-hidden="true"]'));
      const elemento = elements.find(span => {
        return span.textContent.includes("Acerca de");
      });
      
      if(elemento){
        const parentDiv = elemento.parentElement.parentElement.parentElement.parentElement.parentElement;
        const span = parentDiv.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
        if (!span) {
          return null;
        }
        const summary = span.textContent.trim().replace(/\n\s*/g, '')
        return summary;
      } else {
        return null;
      }
    });

    if(summary) {
      profile.summary = summary;
    }
    
    const experiencia = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h2>span[aria-hidden="true"]'));
      const elemento = elements.find(span => {
        return span.textContent.includes("Experiencia");
      });
      
      if(elemento){
        const parentDiv = elemento.parentElement.parentElement.parentElement.parentElement.parentElement;
        const ul = parentDiv.nextElementSibling.firstElementChild;//UL
        if (!ul || ul.tagName !== "UL") {
          return null;
        }
        
        const liElements = ul.querySelectorAll('li');
        return Array.from(liElements).map(li => {
          const divXpath = './div/div[2]/div[1]/div';
          const divJobDescriptionXpath = './div/div[2]/div[2]/ul/li[1]/div/ul/li/div/div/div/div/span[2]';
          var divResult = document.evaluate(divXpath, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          var divElement = divResult.singleNodeValue;
          var divjdResult = document.evaluate(divJobDescriptionXpath, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          var divjdElement = divjdResult.singleNodeValue;
        
          if (!divElement) {
            return null;
          }
        
          // Assuming the divElement contains structured data like job title, company, and dates
          const jobTitleXpath = './/div/div/div/div/span[1]'; // Replace with actual Xpath for job title
          const companyXpath = './/span[1]/span[1]'; // Replace with actual Xpath for company name
          const datesXpath = './/span[2]/span[1]'; // Replace with actual Xpath for dates
          const locationXpath = './/span[3]/span[1]'; // Replace with actual Xpath for dates
        
          // Extract text content for each piece of data
          const jobTitle = document.evaluate(jobTitleXpath, divElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.trim();
          const company = document.evaluate(companyXpath, divElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.trim();
          const dates = document.evaluate(datesXpath, divElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.trim();
          const location = document.evaluate(locationXpath, divElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.trim();
          const jobDescription = divjdElement?.textContent.trim()
        
          // Construct an object with the extracted data
          const experienceObject = {}

          if(jobTitle) experienceObject.jobTitle = jobTitle;
          if(company) experienceObject.company = company;
          if(dates) experienceObject.dates = dates;
          if(location) experienceObject.location = location;
          if(divjdElement) experienceObject.jobDescription = jobDescription;
        
          return experienceObject;
        }).filter(exp => exp != null);

      } else {
        return null;
      }
    });

    if(experiencia) {
      profile.experience = experiencia;
    }
    
    const educacion = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h2>span[aria-hidden="true"]'));
      const elemento = elements.find(span => {
        return span?.textContent.includes("Educación");
      });
      
      if(elemento){
        const parentDiv = elemento.parentElement.parentElement.parentElement.parentElement.parentElement;
        const ul = parentDiv.nextElementSibling.firstElementChild;//UL
        if (!ul || ul.tagName !== "UL") {
          return null;
        }
        
        const liElements = ul.querySelectorAll('li');
        return Array.from(liElements).map(li => {
          const edInstitution = './div/div[2]/div[1]/a/div/div/div/div/span[2]';
          var edInstitutionResult = document.evaluate(edInstitution, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          var edInstitutionElement = edInstitutionResult.singleNodeValue?.textContent.trim();
          
          const edCarreer = './div/div[2]/div[1]/a/span[1]/span[2]';
          var edCarreerResult = document.evaluate(edCarreer, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          var edCarreerElement = edCarreerResult.singleNodeValue?.textContent.trim();
          
          const edDate = './div/div[2]/div[1]/a/span[2]/span[2]';
          var edDateResult = document.evaluate(edDate, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          var edDateElement = edDateResult.singleNodeValue?.textContent.trim();
          
        
          if (!edInstitution) {
            return null;
          }
        
          // Construct an object with the extracted data
          const educationObject = {}

          if(edInstitutionElement) educationObject.edInstitutionElement = edInstitutionElement;
          if(edCarreerElement) educationObject.edCarreerElement = edCarreerElement;
          if(edDateElement) educationObject.edDateElement = edDateElement;
        
          if (Object.keys(educationObject).length === 0) {
            return null;
          }
          return educationObject;
        }).filter(exp => exp != null);

      } else {
        return null;
      }
    });

    if(educacion) {
      profile.education = educacion;
    }

    

    return profile;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

export async function processPostRequest(prompt) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.setViewport({
      width: 1920,
      height: 1024,
    });
    
    await page.setCookie({
      name: "li_at",
      value: process.env.COOKIE,
      domain: ".linkedin.com",
    }); 
  
    await page.goto(prompt);
    
    const profileData = await scrapeProfileData(page);


    await page.close();
    await browser.close();

    
    return (profileData);
  } catch (error) {
    return(error);
  }
}
