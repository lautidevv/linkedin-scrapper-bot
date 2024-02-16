import dotenv from 'dotenv';
// @ts-ignore
import Linkout from 'linkout-scraper'; //TODO: There are no types for this lib
import puppeteer, { Page } from 'puppeteer';

dotenv.config();

async function scrapeProfileData(page: Page) {
  const profile: Record<string, string | (Record<string, string | undefined> | null)[]> = {
    url: page.url(),
  };
  try {
    await page.waitForSelector('.pv-text-details__about-this-profile-entrypoint');

    const fullName = await page.evaluate(() => {
      const titleElement = document.querySelector('.pv-text-details__about-this-profile-entrypoint');
      const h1Element = titleElement?.querySelector('h1');

      if (!h1Element) return null;

      return h1Element.textContent?.trim();
    });

    if (fullName) {
      profile.fullName = fullName;

      const nameParts = fullName.split(' ');

      profile.firstName = nameParts[0];
      if (nameParts.length > 1) profile.lastName = nameParts.slice(1).join(' ');
    }

    const summary = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h2>span[aria-hidden="true"]'));
      const element = elements.find((span) => {
        return span.textContent?.includes('Acerca de');
      });

      if (!element) return null;

      const parentDiv = element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
      const span = parentDiv?.nextElementSibling?.firstElementChild?.firstElementChild?.firstElementChild?.firstElementChild;
      if (!span) return null;

      return span.textContent?.trim().replace(/\n\s*/g, '');
    });

    if (summary) profile.summary = summary;

    const experiencia = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h2>span[aria-hidden="true"]'));
      const element = elements.find((span) => {
        return span.textContent?.includes('Experiencia');
      });

      if (!element) return null;

      const parentDiv = element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
      const ul = parentDiv?.nextElementSibling?.firstElementChild; //UL
      if (!ul || ul.tagName !== 'UL') return null;

      const liElements = ul.querySelectorAll('li');
      return Array.from(liElements)
        .map((li) => {
          const divXpath = './div/div[2]/div[1]/div';
          const divJobDescriptionXpath = './div/div[2]/div[2]/ul/li[1]/div/ul/li/div/div/div/div/span[2]';
          const divResult = document.evaluate(divXpath, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const divElement = divResult.singleNodeValue;
          const divjdResult = document.evaluate(divJobDescriptionXpath, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const divjdElement = divjdResult.singleNodeValue;

          if (!divElement) return null;

          // Assuming the divElement contains structured data like job title, company, and dates
          const jobTitleXpath = './/div/div/div/div/span[1]'; // Replace with actual Xpath for job title
          const companyXpath = './/span[1]/span[1]'; // Replace with actual Xpath for company name
          const datesXpath = './/span[2]/span[1]'; // Replace with actual Xpath for dates
          const locationXpath = './/span[3]/span[1]'; // Replace with actual Xpath for dates

          // Extract text content for each piece of data
          const jobTitle = document
            .evaluate(jobTitleXpath, divElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue?.textContent?.trim();
          const company = document
            .evaluate(companyXpath, divElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue?.textContent?.trim();
          const dates = document
            .evaluate(datesXpath, divElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue?.textContent?.trim();
          const location = document
            .evaluate(locationXpath, divElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue?.textContent?.trim();
          const jobDescription = divjdElement?.textContent?.trim();

          // Construct an object with the extracted data
          const experienceObject: Record<string, string | undefined> = {};

          if (jobTitle) experienceObject.jobTitle = jobTitle;
          if (company) experienceObject.company = company;
          if (dates) experienceObject.dates = dates;
          if (location) experienceObject.location = location;
          if (divjdElement) experienceObject.jobDescription = jobDescription;

          return experienceObject;
        })
        .filter((exp) => exp != null);
    });

    if (experiencia) profile.experience = experiencia;

    const education = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h2>span[aria-hidden="true"]'));
      const element = elements.find((span) => {
        return span?.textContent?.includes('Educación');
      });

      if (!element) return null;

      const parentDiv = element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
      const ul = parentDiv?.nextElementSibling?.firstElementChild; //UL
      if (!ul || ul.tagName !== 'UL') return null;

      const liElements = ul.querySelectorAll('li');
      return Array.from(liElements)
        .map((li) => {
          const edInstitution = './div/div[2]/div[1]/a/div/div/div/div/span[2]';
          const edInstitutionResult = document.evaluate(edInstitution, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const edInstitutionElement = edInstitutionResult.singleNodeValue?.textContent?.trim();

          const edCareer = './div/div[2]/div[1]/a/span[1]/span[2]';
          const edCareerResult = document.evaluate(edCareer, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const edCareerElement = edCareerResult.singleNodeValue?.textContent?.trim();

          const edDate = './div/div[2]/div[1]/a/span[2]/span[2]';
          const edDateResult = document.evaluate(edDate, li, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const edDateElement = edDateResult.singleNodeValue?.textContent?.trim();

          if (!edInstitution) {
            return null;
          }

          // Construct an object with the extracted data
          const educationObject: Record<string, string> = {};

          if (edInstitutionElement) educationObject.edInstitutionElement = edInstitutionElement;
          if (edCareerElement) educationObject.edCareerElement = edCareerElement;
          if (edDateElement) educationObject.edDateElement = edDateElement;

          if (Object.keys(educationObject).length === 0) return null;

          return educationObject;
        })
        .filter((exp) => exp != null);
    });

    if (education) profile.education = education;

    return profile;
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }
}

export async function processPostRequest(prompt: string) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const cdp = await page.target().createCDPSession();

    await page.setViewport({
      width: 1920,
      height: 1024,
    });

    // add ghost-cursor for maximum safety
    await Linkout.tools.loadCursor(page, true);

    // Login with LinkedIn
    await Linkout.services.login(page, cdp, {
      cookie: process.env.COOKIE,
    });

    // Visit a LinkedIn profile
    await Linkout.services.visit(page, cdp, {
      url: prompt,
    });

    const profileData = await scrapeProfileData(page);

    await page.close();
    await browser.close();

    return profileData;
  } catch (error) {
    return error;
  }
}
