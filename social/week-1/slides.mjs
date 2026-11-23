const services = {
  digital: { n: 'Digital', sum: 'Websites designed around how your customers actually decide, then built to be fast, accessible and easy to run.', items: ['Web Design', 'Web Development', 'Digital Experiences'] },
  creative: { n: 'Creative', sum: 'The photos, video and visual direction that make a business look like itself, made for the web from the start.', items: ['Creative Direction', 'Photography', 'Videography', 'Visual Content'] },
  growth: { n: 'Growth', sum: 'What happens after launch: being found, keeping the site current, and improving it as the business changes.', items: ['SEO Foundations', 'Website Management', 'Digital Strategy', 'Ongoing Optimization'] },
};
const svc = (k) => ({ bg: 'light', html: (T) => `<div class="body">${T.bracket(services[k].n)}<p class="statement" style="font-size:66px;margin-top:40px">${services[k].sum}</p>${T.rows(services[k].items)}</div>${T.base('Solace', '')}` });

export const posts = [
  {
    id: 'p1-statement',
    slides: [{ bg: 'light', html: (T) => `<div class="body">${T.bracket('The studio')}<p class="statement" style="font-size:84px;margin-top:56px">Businesses can spend thousands on websites that still feel outdated, generic or disconnected. <span class="fade">We believe businesses deserve better.</span></p></div>${T.base('Creative + digital studio', 'solaceproduction.com')}` }],
  },
  {
    id: 'p5-what-we-do',
    slides: [
      { bg: 'dark', html: (T) => `<div class="body" style="top:330px">${T.bracket('What we do')}<p class="statement" style="font-size:176px;margin-top:56px;line-height:1.02">Digital.<br>Creative.<br><span class="fade">Growth.</span></p></div>${T.base('A creative and digital studio', 'Swipe →')}` },
      svc('digital'), svc('creative'), svc('growth'),
      { bg: 'dark', html: (T) => `<div class="body">${T.bracket('Solace')}<p class="statement" style="font-size:80px;margin-top:56px">Know a business that deserves a better website? <span class="fade">Send this to them.</span></p><span class="pill">Start a project ↗</span></div>${T.base('Creative + digital studio', 'solaceproduction.com')}` },
    ],
  },
  {
    id: 'p6-after-launch',
    slides: [
      { bg: 'paper', html: (T) => `<div class="body" style="top:330px">${T.bracket('Website management')}<p class="statement" style="font-size:150px;margin-top:56px;line-height:1.02">Launching isn’t <span class="fade">where it ends.</span></p></div>${T.base('Solace', 'Swipe →')}` },
      { bg: 'light', html: (T) => `<div class="body">${T.bracket('Our promise')}<p class="statement" style="font-size:104px;margin-top:56px">You run the business. <span class="fade">We take care of the website.</span></p></div>${T.base('Solace', '')}` },
      { bg: 'light', html: (T) => `<div class="body" style="top:250px">${T.bracket('Kept running')}<p class="statement" style="font-size:76px;margin-top:40px">So it never goes down.</p>${T.rows(['Hosting', 'SSL and security', 'Backups', 'Maintenance', 'Technical support', 'Performance monitoring'])}</div>${T.base('Solace', '')}` },
      { bg: 'light', html: (T) => `<div class="body" style="top:250px">${T.bracket('Kept current')}<p class="statement" style="font-size:76px;margin-top:40px">So it always matches the business.</p>${T.rows(['Hours updates', 'Price updates', 'Service and menu updates', 'Photo replacements', 'Small text changes', 'Minor content changes'])}</div>${T.base('Solace', '')}` },
      { bg: 'dark', html: (T) => `<div class="body">${T.bracket('Bigger changes')}<p class="statement" style="font-size:72px;margin-top:56px">Redesigns, new pages or major functionality get <span class="fade">a separate quote before any work begins.</span></p><span class="pill">Start a project ↗</span></div>${T.base('Creative + digital studio', 'solaceproduction.com')}` },
    ],
  },
];
