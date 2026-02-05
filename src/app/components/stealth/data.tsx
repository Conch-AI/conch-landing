import Image from "next/image";
import { contentAtScale, crossPlag, gptZero, turnitin } from "./svgs";
export const Detectors = [
  {
    label: "GPTzero",
    icon: (
      <Image
        src={gptZero}
        width={20}
        height={20}
        className="h-[1rem] w-[1rem]"
        alt="Ai detectors icon"
      />
    ),
  },
  {
    label: "Turnitin",
    icon: (
      <Image
        src={turnitin}
        width={20}
        height={20}
        className="h-[1rem] w-[1rem]"
        alt="Ai detectors icon"
      />
    ),
  },
  {
    label: "Writer",
    icon: (
      <div className="-mt-[.5rem] mr-1 h-[1rem] w-[1rem]">
        <p className="font-bold italic">W</p>
      </div>
    ),
  },
  {
    label: "OpenAI",
    icon: (
      <svg
        className="h-[1rem] w-[1rem]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.5624 10.1875C20.8124 9.5 20.8749 8.8125 20.8124 8.125C20.7499 7.4375 20.4999 6.75 20.1874 6.125C19.6249 5.1875 18.8124 4.4375 17.8749 4C16.8749 3.5625 15.8124 3.4375 14.7499 3.6875C14.2499 3.1875 13.6874 2.75 13.0624 2.4375C12.4374 2.125 11.6874 2 10.9999 2C9.9374 2 8.8749 2.3125 7.9999 2.9375C7.1249 3.5625 6.4999 4.4375 6.1874 5.4375C5.4374 5.625 4.8124 5.9375 4.1874 6.3125C3.6249 6.75 3.1874 7.3125 2.8124 7.875C2.24991 8.8125 2.06241 9.875 2.18741 10.9375C2.31241 12 2.7499 13 3.4374 13.8125C3.1874 14.5 3.1249 15.1875 3.1874 15.875C3.2499 16.5625 3.4999 17.25 3.8124 17.875C4.3749 18.8125 5.1874 19.5625 6.1249 20C7.1249 20.4375 8.1874 20.5625 9.2499 20.3125C9.7499 20.8125 10.3124 21.25 10.9374 21.5625C11.5624 21.875 12.3124 22 12.9999 22C14.0624 22 15.1249 21.6875 15.9999 21.0625C16.8749 20.4375 17.4999 19.5625 17.8124 18.5625C18.4999 18.4375 19.1874 18.125 19.7499 17.6875C20.3124 17.25 20.8124 16.75 21.1249 16.125C21.6874 15.1875 21.8749 14.125 21.7499 13.0625C21.6249 12 21.2499 11 20.5624 10.1875ZM13.0624 20.6875C12.0624 20.6875 11.3124 20.375 10.6249 19.8125C10.6249 19.8125 10.6874 19.75 10.7499 19.75L14.7499 17.4375C14.8749 17.375 14.9374 17.3125 14.9999 17.1875C15.0624 17.0625 15.0624 17 15.0624 16.875V11.25L16.7499 12.25V16.875C16.8124 19.0625 15.0624 20.6875 13.0624 20.6875ZM4.9999 17.25C4.5624 16.5 4.3749 15.625 4.5624 14.75C4.5624 14.75 4.6249 14.8125 4.6874 14.8125L8.6874 17.125C8.8124 17.1875 8.8749 17.1875 8.9999 17.1875C9.1249 17.1875 9.2499 17.1875 9.3124 17.125L14.1874 14.3125V16.25L10.1249 18.625C9.2499 19.125 8.2499 19.25 7.3124 19C6.3124 18.75 5.4999 18.125 4.9999 17.25ZM3.9374 8.5625C4.3749 7.8125 5.0624 7.25 5.8749 6.9375V7.0625V11.6875C5.8749 11.8125 5.8749 11.9375 5.9374 12C5.9999 12.125 6.0624 12.1875 6.1874 12.25L11.0624 15.0625L9.3749 16.0625L5.3749 13.75C4.4999 13.25 3.8749 12.4375 3.6249 11.5C3.3749 10.5625 3.4374 9.4375 3.9374 8.5625ZM17.7499 11.75L12.8749 8.9375L14.5624 7.9375L18.5624 10.25C19.1874 10.625 19.6874 11.125 19.9999 11.75C20.3124 12.375 20.4999 13.0625 20.4374 13.8125C20.3749 14.5 20.1249 15.1875 19.6874 15.75C19.2499 16.3125 18.6874 16.75 17.9999 17V12.25C17.9999 12.125 17.9999 12 17.9374 11.9375C17.9374 11.9375 17.8749 11.8125 17.7499 11.75ZM19.4374 9.25C19.4374 9.25 19.3749 9.1875 19.3124 9.1875L15.3124 6.875C15.1874 6.8125 15.1249 6.8125 14.9999 6.8125C14.8749 6.8125 14.7499 6.8125 14.6874 6.875L9.8124 9.6875V7.75L13.8749 5.375C14.4999 5 15.1874 4.875 15.9374 4.875C16.6249 4.875 17.3124 5.125 17.9374 5.5625C18.4999 6 18.9999 6.5625 19.2499 7.1875C19.4999 7.8125 19.5624 8.5625 19.4374 9.25ZM8.9374 12.75L7.2499 11.75V7.0625C7.2499 6.375 7.4374 5.625 7.8124 5.0625C8.1874 4.4375 8.7499 4 9.3749 3.6875C9.9999 3.375 10.7499 3.25 11.4374 3.375C12.1249 3.4375 12.8124 3.75 13.3749 4.1875C13.3749 4.1875 13.3124 4.25 13.2499 4.25L9.2499 6.5625C9.1249 6.625 9.0624 6.6875 8.9999 6.8125C8.9374 6.9375 8.9374 7 8.9374 7.125V12.75ZM9.8124 10.75L11.9999 9.5L14.1874 10.75V13.25L11.9999 14.5L9.8124 13.25V10.75Z"></path>
      </svg>
    ),
  },
  {
    label: "Copyleaks",
    icon: (
      <svg
        className="h-[1rem] w-[1rem]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16.2877 9.42773C15.413 7.97351 13.8195 7 12 7 9.23999 7 7 9.23999 7 12 7 14.76 9.23999 17 12 17 13.8195 17 15.413 16.0265 16.2877 14.5723L14.5729 13.5442C14.0483 14.4166 13.0927 15 12 15 10.3425 15 9 13.6575 9 12 9 10.3425 10.3425 9 12 9 13.093 9 14.0491 9.58386 14.5735 10.4568L16.2877 9.42773ZM22 12C22 6.47998 17.52 2 12 2 6.47998 2 2 6.47998 2 12 2 17.52 6.47998 22 12 22 17.52 22 22 17.52 22 12ZM4 12C4 7.57996 7.57996 4 12 4 16.42 4 20 7.57996 20 12 20 16.42 16.42 20 12 20 7.57996 20 4 16.42 4 12Z"></path>
      </svg>
    ),
  },
  {
    label: "Crossplag",
    icon: (
      <Image
        src={crossPlag}
        width={20}
        height={20}
        className="h-[1rem] w-[1rem]"
        alt="Ai detectors icon"
      />
    ),
  },
  {
    label: "Content at Scale",
    icon: (
      <Image
        src={contentAtScale}
        width={20}
        className="h-[1rem] w-[1rem]"
        height={20}
        alt="Ai detectors icon"
      />
    ),
  },
];

export const STEALTH_SAMPLE_TEXT = `Uranus, the seventh planet from the Sun, captivates with its distinctive blue-green color, a result of methane in its atmosphere. As a gas giant, it shares characteristics with Jupiter and Saturn but sets itself apart with a dramatic axial tilt of approximately 98 degrees, causing the planet to rotate on its side. This unique orientation results in extreme seasonal changes, where each pole alternates between 42 years of continuous sunlight and 42 years of darkness.

First discovered in 1781 by astronomer William Herschel, Uranus was the inaugural planet identified through a telescope, spaning a pivotal advancement in the field of astronomy. Its frigid atmosphere, dominated by hydrogen and helium with traces of water, ammonia, and methane, sees temperatures plummet to around -224 degrees Celsius, making it one of the coldest places in the solar system.

Discovered in 1781 by William Herschel, Uranus was the first planet found with the aid of a telescope, revolutionizing our understanding of the solar system. Its atmosphere, primarily composed of hydrogen and helium with traces of water, ammonia, and methane, sees temperatures drop to around -224 degrees Celsius, making Uranus one of the coldest places in our solar system. The planet also features a faint ring system consisting of 13 known rings made up of dark, rocky particles, first discovered in 1977.`;

export const STEALTH_AI_HIGHLIGHT_COLOR = "rgb(208, 182, 94)";
export const STEALTH_GRAMMER_HIGHLIGHT_COLOR = "#F3646080";
export const INITIAL_EDITOR_TEXT = '<p class="tiptap-paragraph"></p>';
export const newStealthPresetSamples = {
  aiPlusHuman: `Uranus is the seventh planet from the Sun and the third-largest in our solar system by diameter. It is a gas giant, like Jupiter and Saturn, but is classified as an ice giant due to its composition. Here are some key facts about Uranus:

  Discovery: It was discover in 1781 and it was discovered with a telescope.
  
  Orbit and Rotation: It takes 84 Earth years to complete one orbit around the Sun.
  
  Atmosphere; The primary components of Uranus atmosphere are hydrogen and helium with traces of methane that lend it its blue green hue.
  
  Uranus ranks as the planet in our solar system with a significant size compared to Earth. With a diameter of 31,764 miles it is four times larger than our home planet. Similar to gas giants in our system Uranus consists of a mixture of gases, liquids and solids without a solid surface, for support. The solid components mainly comprise silicon, iron and rock resembling basalt.
  
  Uranus has a core in size, to Earth at its center. Surrounding this core is a mixture of elements blending into an ocean that envelops the rocky center of the planet. This ocean reaches depths of around 5,000 miles deeper, than the parts of Earths oceans which are only about seven miles deep. Scientists believe that Uranus ocean consists of water with traces of ammonia and methane.`,

  gpt4: `Mars, often referred to as the "Red Planet," is the fourth planet from the Sun in our solar system. Named after the Roman god of war, it is distinguished by its reddish appearance, which is due to iron oxide (rust) on its surface. Mars is a terrestrial planet with a thin atmosphere, composed primarily of carbon dioxide, with surface features reminiscent both of the Moon and Earth. It has the largest volcano in the solar system, Olympus Mons, and the deepest, longest canyon, Valles Marineris. Evidence suggests that Mars once had liquid water on its surface, raising the possibility that it may have supported life in the past.

  Exploration of Mars has been a major focus of space missions in the last few decades. Robotic rovers, orbiters, and landers have provided a wealth of information about the planet's geology, climate, and potential for harboring life. The most notable missions include NASA's Mars rovers: Spirit, Opportunity, Curiosity, and Perseverance, which have explored the Martian surface and conducted various scientific experiments. The search for past or present life on Mars remains a key goal of planetary science, with future missions planned to further investigate this intriguing possibility and to eventually pave the way for human exploration.`,

  claude: `The solar system is a vast and intricate system that revolves around the Sun, a star that provides the necessary energy and gravity to hold everything together. At its heart lies the Sun, a massive spherical ball of hot plasma that accounts for over 99% of the entire system's mass. Orbiting the Sun are eight planets, each with its unique characteristics and features. These planets, in order of their distance from the Sun, are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Beyond the planets lies the Kuiper Belt, a region of icy bodies, and the Oort Cloud, a vast spherical cloud of icy objects that spans the outer edge of the solar system.

  The solar system is a dynamic and ever-changing environment. Planets revolve around the Sun in elliptical orbits, while moons orbit around their respective planets. Asteroids, comets, and meteoroids also populate the solar system, adding to its complexity. The study of the solar system has led to respanable discoveries, from the moons of Jupiter and Saturn to the dwarf planets like Pluto and Ceres. Understanding the solar system has not only deepened our knowledge of the universe but has also inspired humankind to explore the cosmos further, with robotic probes and human missions reaching out to explore the wonders of our celestial neighborhood.`,
};

export const FREE_STYLES = ["Standard", "Fluency"];

export const ModeOptions = [
  "Standard",
  "Fluency",
  "Natural",
  "Formal",
  "Academic",
  "Simple",
  "Creative",
  "Expand",
  "Shorten",
];

export const ModeTooltips = [
  "Rewrites text with new vocabulary and work order",
  "Improves the clarity & readability of text",
  "Rewrites text in a more human, authentic way",
  "Rephrases text in a more sophisticated way",
  "Expresses text in a more technical and scholarly way",
  "Presents text in a way that's easier to understand",
  "Rephrases text in an original and innovative way",
  "Increases the length of the text",
  "Conveys the meaning of text concisely",
];

export const ModeSamples: Record<
  string,
  { original: string; converted: string }
> = {
  Natural: {
    original: `<p>Photosynthesis is the process by which green plants use sunlight to synthesize foods.</p>`,
    converted: `<p>Photosynthesis is how green plants <span style="color: #06d606;">capture sunlight</span> to make their own food.</p>`,
  },
  Formal: {
    original: `<p>Photosynthesis is the process by which green plants use sunlight to synthesize foods.</p>`,
    converted: `<p>Photosynthesis is the process by which <span style="color: #06d606;">autotrophic organisms</span> utilize <span style="color: #06d606;">solar energy</span> to synthesize <span style="color: #06d606;">organic compounds</span> essential for their sustenance.</p>`,
  },
  Academic: {
    original: `<p>Photosynthesis is the process by which green plants use sunlight to synthesize foods.</p>`,
    converted: `<p><span style="color: #06d606;">Photosynthesis</span> is the process by which <span style="color: #06d606;">plants</span> convert <span style="color: #06d606;">light energy</span> into <span style="color: #06d606;">chemical energy</span>.</p>
`,
  },
  Simple: {
    original: `<p>Photosynthesis is the process by which green plants use sunlight to synthesize foods.</p>`,
    converted: `<p>Photosynthesis is the process by which <span style="color: #06d606;">plants</span> use <span style="color: #06d606;">light from the sun</span> to make <span style="color: #06d606;">their own food</span>.</p>
`,
  },

  Creative: {
    original: `<p>Photosynthesis is the process by which green plants use sunlight to synthesize foods.</p>`,
    converted: `<p><span style="color: #06d606;">In nature's quiet symphony</span>, green plants <span style="color: #06d606;">transform sunlight</span> into life-giving energy, weaving a delicate balance that nourishes all.</p>`,
  },
  Expand: {
    original: `<p>Photosynthesis is the process by which green plants use sunlight to synthesize foods.</p>`,
    converted: `<p>Photosynthesis is the <span style="color: #06d606;">natural</span> process by which green plants use sunlight to <span style="color: #06d606;">convert</span> carbon dioxide and water into <span style="color: #06d606;">essential nutrients</span>, primarily glucose, which acts as food for their growth and energy.</p>
`,
  },
  Shorten: {
    original: `<p>Photosynthesis is the process by which green plants use sunlight to synthesize foods.</p>`,
    converted: `<p>Photosynthesis is how green plants <span style="color: #06d606;">use</span> sunlight to <span style="color: #06d606;">make</span> food.</p>
`,
  },
};
