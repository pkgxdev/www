import React from "react";
import { Helmet } from "react-helmet";
import { useIsMobile } from "../utils/useIsMobile";
import { cn } from "../utils/cn";
import backgroundPattern from "../assets/pkgx-bg-pattern-right.svg";
import tea3dLogo from "../assets/tea-3d-logo.png";
import teaGlitch from "../assets/tea-glitch.png";

const fallbackStats = {
  assam: {
    totalBlocks: "3.055M",
    dailyTransactions: "2.17M",
    totalTransactions: "90.155M",
    walletAddresses: "349.601M",
  },
  sepolia: {
    totalBlocks: "303.2k",
    dailyTransactions: "329.2k",
    totalTransactions: "661.8k",
    walletAddresses: "687.8k",
    kycAttestations: "30.5k",
  },
};

const features = [
  {
    title: "A New Brew: The Journey From Homebrew to tea",
    description:
      "Homebrew changed how developers managed software. Now, tea is evolving the model for the open-source era—not just packaging software but packaging incentives. By leveraging smart contracts, tokenized rewards, and a global dependency tree, tea ensures that contributions are recognized, ranked, and rewarded across the entire open-source stack.",
  },
  {
    title: "teaRANK: The PageRank for Open Source",
    description:
      "Open source powers everything, but which packages power open source? teaRANK, tea's novel global dependency tree, ranks software based on real usage and impact—just like PageRank did for the web.",
  },
  {
    title: "PKGX & teaBase: Developer Experience, Reinvented",
    description:
      "Developers deserve magic, not headaches. PKGX, our next-gen package manager, makes installing, updating, and securing dependencies effortless. Meanwhile, teaBase serves as the on-chain registry.",
  },
  {
    title: "Open Source Should Be Rewarding. Now It Is.",
    description:
      "For too long, open source has been powered by passion, not paychecks. tea is changing the economics of open source, ensuring that every maintainer, contributor, and developer gets their fair share.",
  },
];

const TeaProtocol = () => {
  const isxs = useIsMobile();
  const [assamStats, setAssamStats] = React.useState(fallbackStats["assam"]);
  const [sepoliaStats, setSepoliaStats] = React.useState(fallbackStats["sepolia"]);

  React.useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(
        `https://yo2fkzmf2rh33u2b3bi3xhtqyi0toyqz.lambda-url.us-east-1.on.aws/?url=/stats&network=assam`
      );
      const data = await response.json();
      setAssamStats({
        totalBlocks: parseInt(data.total_blocks).toLocaleString(),
        dailyTransactions: `${(parseInt(data.transactions_today) / 1000000).toFixed(2)}M`,
        totalTransactions: parseInt(data.total_transactions).toLocaleString(),
        walletAddresses: parseInt(data.total_addresses).toLocaleString(),
      });

      const response2 = await fetch(
        `https://yo2fkzmf2rh33u2b3bi3xhtqyi0toyqz.lambda-url.us-east-1.on.aws/?url=/stats&network=sepolia`
      );
      const data2 = await response2.json();
      const response3 = await fetch("https://api.sepolia.app.tea.xyz/kycCount");
      const data3 = await response3.json();
      setSepoliaStats({
        totalBlocks: parseInt(data2.total_blocks).toLocaleString(),
        dailyTransactions: `${(parseInt(data2.transactions_today) / 1000000).toFixed(2)}M`,
        totalTransactions: parseInt(data2.total_transactions).toLocaleString(),
        walletAddresses: parseInt(data2.total_addresses).toLocaleString(),
        kycAttestations: parseInt(data3.kycCount).toLocaleString(),
      });
    };

    fetchStats().catch((error) => {
      console.error("Error fetching stats:", error);
      setAssamStats(fallbackStats["assam"]);
      setSepoliaStats(fallbackStats["sepolia"]);
    });
  }, []);

  function formatKey(key: string) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  }

  return (
    <>
      <Helmet>
        <title>Tea Protocol - Something New is Brewing</title>
        <meta property="og:title" content="Tea Protocol - Something New is Brewing" />
        <meta property="og:description" content="Get rewards for open-source contributions" />
        <meta property="og:image" content="https://cdn.prod.website-files.com/650d0534262efafa72b3ccab/651a34689cfb3be975d1d0aa_tea_og_01.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pkgx.dev/tea" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div
        className="min-h-screen w-full bg-contain bg-no-repeat bg-bottom bg-right"
        style={{ backgroundImage: `url(${backgroundPattern})` }}
      >
        {/* Metrics Section */}
        <div className="max-w-5xl mx-auto text-center py-6 md:py-10 px-4">
          <div className="max-w-[700px] mx-auto mb-8">
            <h2 className="text-[32px] font-extrabold leading-tight text-[#EDF2EF]">
              Everyone's <span className="text-[#F26212]">sipping the tea</span>.
            </h2>
            <p className="text-[#EDF2EF] mt-2">
              tea Protocol is trusted by hundreds of thousands of developers, contributors, and organizations worldwide.
            </p>
          </div>

          {/* Sepolia Stats */}
          <h3 className="text-[24px] font-extrabold text-[#EDF2EF] mb-4">Sepolia Network Stats</h3>
          <div className={cn("grid gap-4 justify-center mb-8", isxs ? "grid-cols-2" : "grid-cols-5")}>
            {Object.entries(sepoliaStats).map(([key, value]) => (
              <div key={key}>
                <p className="font-bold text-[32px] text-[#EDF2EF]">{value}</p>
                <p className="text-[#EDF2EF]">{formatKey(key)}</p>
              </div>
            ))}
          </div>

          {/* Assam Stats */}
          <h3 className="text-[24px] font-extrabold text-[#EDF2EF] mb-4">Assam Network Stats (deprecated)</h3>
          <div className={cn("grid gap-4 justify-center", isxs ? "grid-cols-2" : "grid-cols-4")}>
            {Object.entries(assamStats).map(([key, value]) => (
              <div key={key}>
                <p className="font-bold text-[32px] text-[#EDF2EF]">{value}</p>
                <p className="text-[#EDF2EF]">{formatKey(key)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-5xl mx-auto py-6 md:py-10 px-4">
          <div className={cn("grid gap-8 items-stretch", isxs ? "grid-cols-1" : "grid-cols-2")}>
            {isxs ? null : (
              <div className="order-2 md:order-2">
                <div className="bg-[#11111C] rounded-lg flex justify-center items-center h-full w-full min-h-[300px]">
                  <img src={tea3dLogo} alt="tea logo" className="w-4/5 max-w-[300px]" />
                </div>
              </div>
            )}
            <div className={cn(isxs ? "text-center order-1" : "text-left order-1", "flex flex-col justify-center")}>
              <p className="text-sm font-medium uppercase text-[#F26212] mb-2">From the creator of homebrew</p>
              <h1 className="text-[48px] font-extrabold leading-tight text-[#EDF2EF]">
                Something New is Brewing: <span className="text-[#F26212]">The Future of Open Source is On-Chain</span>
              </h1>
              <p className="text-[#EDF2EF] mt-4">
                The world of open source is long overdue for a revolution. At tea.xyz, we're brewing something powerful—an{" "}
                <strong>Optimism Stack-based Layer-2 Ethereum network</strong> designed to{" "}
                <strong>incentivize, sustain, and supercharge open-source development</strong>.
              </p>
              <p className="text-[#EDF2EF] mt-4">
                We're bringing something new <strong>to Ethereum</strong>, with a{" "}
                <strong>custom precompile that enables GPG keys to sign transactions natively</strong>.
              </p>
              <p className="text-[#EDF2EF] mt-4">
                As a proud part of the <strong>Optimism ecosystem</strong>, tea is built to{" "}
                <strong>welcome the next wave of hundreds of thousands of open-source developers</strong>.
              </p>
              <div className={cn("mt-6", isxs ? "text-center" : "text-left")}>
                <a
                  href="https://tea.xyz"
                  className="inline-block bg-[#74FAD1] text-[#0A0711] px-6 py-3 rounded text-lg font-medium hover:bg-[#5ee8bf] transition-colors no-underline"
                >
                  Learn more about tea
                </a>
              </div>
            </div>
            {isxs && (
              <div className="order-2">
                <div className="bg-[#11111C] rounded-lg flex justify-center items-center h-[300px] w-full">
                  <img src={tea3dLogo} alt="tea logo" className="w-4/5 max-w-[300px]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Section */}
        <div className="max-w-5xl mx-auto py-6 md:py-10 px-4">
          <div className={cn("grid gap-4 items-start", isxs ? "grid-cols-1" : "grid-cols-12")}>
            <div className={isxs ? "" : "col-span-4"}>
              <img src={teaGlitch} alt="tea glitch" className="w-full aspect-square rounded-lg mb-4" />
              <h2 className="text-[32px] font-extrabold text-[#EDF2EF] mb-4">
                There's something brewing for <span className="text-[#F26212]">everyone</span>.
              </h2>
              <p className="text-[#EDF2EF]">
                There are plenty of ways for developers and speculators alike to participate in tea's testnet.
              </p>
            </div>
            <div className={isxs ? "" : "col-span-8"}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-[#EDF2EF] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#EDF2EF]">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-5xl mx-auto py-6 md:py-10 px-4">
          <div className={cn("grid gap-4 items-center", isxs ? "grid-cols-1" : "grid-cols-2")}>
            <div className="text-center">
              <h2 className="text-[32px] font-extrabold text-[#EDF2EF]">
                Ready to <span className="text-[#F26212]">Get Started</span>?
              </h2>
              <p className="text-[#EDF2EF] mt-2">
                Join the tea party and start making your mark on the testnet. The open source revolution is here.
              </p>
              <div className="flex justify-center mt-4">
                <a
                  href="https://tea.xyz"
                  className="inline-block bg-[#74FAD1] text-[#0A0711] px-6 py-3 rounded text-lg font-medium hover:bg-[#5ee8bf] transition-colors no-underline"
                >
                  Learn more about tea
                </a>
              </div>
            </div>
            <div>
              <img
                src="/imgs/pkgx-3d-glyphs.png"
                alt="PKGX 3D Glyphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeaProtocol;
