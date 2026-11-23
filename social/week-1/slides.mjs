// Image-led versions. Sources: site/src/assets (hero + studio images are AI-generated brand imagery; work shots are real site screenshots).
const photo = (T, img, pos) => `<div class="bg" style="background-image:url(${T.asset(img)});background-position:${pos} 50%"></div><div class="grad"></div>`;
const band = (T, img, pos) => `<div class="band-img" style="background-image:url(${T.asset(img)});background-position:50% ${pos}"></div>`;

const svc = (n, sum, items, img, pos) => ({
  bg: 'light has-band',
  html: (T) => `${band(T, img, pos)}<div class="body" style="top:640px">${T.bracket(n)}<p class="statement" style="font-size:54px;margin-top:28px">${sum}</p><p class="items">${items.join(' / ')}</p></div>${T.base('Solace', '')}`,
});
const list = (n, title, items, img, pos) => ({
  bg: 'light has-band',
  html: (T) => `${band(T, img, pos)}<div class="body" style="top:640px">${T.bracket(n)}<p class="statement" style="font-size:62px;margin-top:28px">${title}</p>${T.rows(items)}</div>`,
});

export const posts = [
  {
    id: 'p1-statement',
    slides: [{ bg: 'photo', html: (T) => `${photo(T, 'hero/reveal-night.jpg', '62%')}<div class="body" style="top:auto;bottom:190px">${T.bracket('The studio')}<p class="statement" style="font-size:96px;margin-top:36px">A digital presence <span class="fade">worthy of the business behind it.</span></p></div>${T.base('Creative + digital studio', 'solaceproduction.com')}` }],
  },
  {
    id: 'p5-what-we-do',
    slides: [
      { bg: 'photo', html: (T) => `${photo(T, 'hero/technology-poster.jpg', '50%')}<div class="body" style="top:auto;bottom:190px">${T.bracket('What we do')}<p class="statement" style="font-size:150px;margin-top:36px;line-height:1.02">Digital.<br>Creative.<br><span class="fade">Growth.</span></p></div>${T.base('A creative and digital studio', 'Swipe →')}` },
      svc('Digital', 'Websites designed around how your customers actually decide, then built to be fast, accessible and easy to run.', ['Web design', 'Web development', 'Digital experiences'], 'work/nail-xpress/cover.jpg', '0%'),
      svc('Creative', 'The photos, video and visual direction that make a business look like itself, made for the web from the start.', ['Creative direction', 'Photography', 'Videography', 'Visual content'], 'work/guerrero-boxing-gym/detail-1.jpg', '30%'),
      svc('Growth', 'What happens after launch: being found, keeping the site current, and improving it as the business changes.', ['SEO foundations', 'Website management', 'Digital strategy', 'Ongoing optimization'], 'studio/seagulls.jpg', '40%'),
      { bg: 'dark', html: (T) => `<div class="body">${T.bracket('Solace')}<p class="statement" style="font-size:80px;margin-top:56px">Know a business that deserves a better website? <span class="fade">Send this to them.</span></p><span class="pill">Start a project ↗</span></div>${T.base('Creative + digital studio', 'solaceproduction.com')}` },
    ],
  },
  {
    id: 'p6-after-launch',
    slides: [
      { bg: 'photo', html: (T) => `${photo(T, 'hero/reveal-day.jpg', '56%')}<div class="body" style="top:auto;bottom:190px">${T.bracket('Website management')}<p class="statement" style="font-size:132px;margin-top:36px;line-height:1.02">Launching isn’t <span class="fade">where it ends.</span></p></div>${T.base('Solace', 'Swipe →')}` },
      { bg: 'paper', html: (T) => `<div class="body">${T.bracket('Our promise')}<p class="statement" style="font-size:104px;margin-top:56px">You run the business. <span class="fade">We take care of the website.</span></p></div>${T.base('Solace', '')}` },
      list('Kept running', 'So it never goes down.', ['Hosting', 'SSL and security', 'Backups', 'Performance monitoring'], 'work/guerrero-boxing-gym/detail-2.jpg', '40%'),
      list('Kept current', 'So it always matches the business.', ['Hours updates', 'Price updates', 'Photo replacements', 'Small text changes'], 'work/nail-xpress/detail-2.jpg', '45%'),
      { bg: 'dark', html: (T) => `<div class="body">${T.bracket('Bigger changes')}<p class="statement" style="font-size:72px;margin-top:56px">Redesigns, new pages or major functionality get <span class="fade">a separate quote before any work begins.</span></p><span class="pill">Start a project ↗</span></div>${T.base('Creative + digital studio', 'solaceproduction.com')}` },
    ],
  },
];
