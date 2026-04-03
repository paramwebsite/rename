import { useEffect, useMemo, useState } from "react";
import { getWS, sendJSON } from "../../utils/ws";

const OUTER_PATH =
  "M 596.00 651.25 C596.01,642.39 599.21,627.36 602.42,621.15 L 603.87 618.35 L 594.73 614.21 C578.95,614.82 559.05,610.50 544.82,603.38 C537.75,599.84 533.05,599.12 510.16,598.08 C493.63,597.32 486.09,597.42 475.01,598.53 C459.43,600.10 458.72,600.25 438.00,606.47 C422.26,611.20 416.98,612.36 404.00,613.96 C393.11,615.30 391.19,615.21 381.33,612.93 C365.73,609.34 353.99,601.47 349.36,591.52 C346.02,584.36 346.32,573.98 349.87,574.02 C350.76,574.02 356.90,576.96 363.50,580.53 C384.10,591.70 389.98,594.34 394.38,594.42 C398.09,594.49 398.53,594.24 398.80,591.91 L 399.10,589.32 L 403.72,591.66 C408.92,594.29 414.78,594.75 415.60,592.59 C416.94,589.12 410.53,581.99 400.50,575.79 C394.61,572.15 384.19,568.22 375.85,566.49 C363.41,563.92 363.32,563.85 360.53,554.63 C354.21,533.79 351.42,514.65 352.99,503.00 C353.47,499.42 355.06,492.00 356.52,486.50 C359.75,474.31 360.05,463.22 357.58,447.50 C354.68,429.08 357.41,415.33 367.18,399.00 L 371.67,391.50 L 378.59,391.63 C382.39,391.70 395.85,393.38 408.50,395.37 C462.28,403.81 495.07,406.60 530.14,405.71 C546.75,405.29 553.50,404.71 560.50,403.09 C576.03,399.51 586.26,393.22 593.20,383.00 L 594.90,380.50 L 594.95,382.85 C594.98,384.15 596.67,388.42 598.71,392.35 C601.54,397.80 605.17,402.25 613.97,411.07 C622.16,419.26 626.51,424.51 628.91,429.07 C630.77,432.60 633.84,437.63 635.73,440.24 C639.15,444.97 652.93,456.88 669.00,468.99 C680.38,477.57 689.74,486.62 692.30,491.50 C695.29,497.22 695.13,505.00 691.87,512.00 C688.85,518.48 686.52,521.33 666.99,542.50 C658.87,551.30 650.08,561.20 647.45,564.50 C644.82,567.80 641.56,571.40 640.20,572.50 C634.88,576.81 616.52,597.93 611.38,605.64 L 605.96,613.78 L 596.00,651.25 Z";

// A simplified, clean convex-hull-style outer boundary — easier to maintain
const CLEAN_OUTER_PATH =
  "M 595 360 C 598 358 608 368 618 378 L 625 385 L 625 399 C 625 415 626 420 631 425 C 633 427 645 436 658 445 C 706 478 709 481 710 498 C 711 506 708 515 703 522 C 699 529 685 542 668 556 C 649 572 643 578 637 587 C 626 605 616 631 613 651 C 612 656 611 657 610 658 C 608 660 599 664 596 664 C 594 664 593 660 593 655 C 593 645 596 630 600 623 L 602 619 L 583 618 C 561 616 553 615 540 610 C 515 601 507 600 488 601 C 474 601 461 604 445 609 C 429 614 417 616 401 617 C 382 619 374 619 364 616 C 340 610 327 597 327 582 C 327 577 327 576 330 573 C 334 570 338 569 352 569 C 363 569 364 569 371 572 C 375 574 382 578 387 580 C 393 584 394 584 392 582 C 388 578 371 570 359 567 C 346 564 345 563 342 549 C 335 522 334 501 339 482 C 342 471 342 464 340 452 C 338 441 338 427 340 419 C 342 411 349 396 353 393 C 355 392 359 390 363 388 L 371 386 L 400 387 C 427 388 430 388 449 392 C 493 400 519 401 543 395 C 561 390 583 377 593 364 L 595 360 Z";

const displayId = 12;

function Display12() {
  const ws = useMemo(() => getWS(), []);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      // register this display
      sendJSON(ws, { type: "registerDisplay", displayId });
    };

    const onMessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      if (msg.type === "newName") {
        console.log("Received new name:", msg.name);
        setName(msg.name);
        generateImage(msg.name);
      }

      if (msg.type === "resetDisplay") {
        setName("");
      }
    };

    if (ws.readyState === WebSocket.OPEN) onOpen();
    else ws.addEventListener("open", onOpen);

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", onMessage);
      // ⚠️ don't ws.close() because ws is a shared singleton (like your old getSocket)
    };
  }, [ws]);

  const generateImage = async (nameToUSe) => {
    if (!nameToUSe) {
      console.log("generateImage", nameToUSe);
      return;
    }

    setLoading(true);
    setImage(null);

    try {
      const response = await fetch(
        "https://api.getimg.ai/v1/stable-diffusion/text-to-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GETIMG_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: `A cinematic portrait embodying the essence of the name "${nameToUSe}". 
                    Dramatic lighting, rich colors, shallow depth of field, highly detailed, 
                    photorealistic, professional photography style, 8k resolution,
                    centered composition with subject occupying 60% of frame, 
                    generous negative space and breathing room on all sides, 
                    wide natural border padding around the central subject, 
                    do not crop subject, full subject visible with space around it`,
            width: 896,
            height: 640,
            steps: 30,
          }),
        },
      );

      const data = await response.json();

      setImage(data.image || data.images?.[0]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  bg-gray-400">
      {/* --------2nds svg--------------- */}
      {name ? (
        <div className="w-[700px] aspect-[391 / 300] relative  overflow-hidden ">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-black">
              Generating...
            </div>
          )}

          <svg
            viewBox="328 359 380 302"
            className="flex justify-center items-center"
            style={{ display: "block", background: "transparent" }}
          >
            <defs>
              <clipPath id="frameClip">
                <path d={OUTER_PATH} /> {/* ← single closed path */}
              </clipPath>
            </defs>

            {image && !loading && (
              <image
                href={`data:image/png;base64,${image}`}
                x="310"
                y="350"
                width="420"
                height="330"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#frameClip)"
              />
            )}

            <path
              d="M 596.00 651.25 C596.01,642.39 599.21,627.36 602.42,621.15 L 603.87 618.35 L 584.50 617.18 C563.16,615.88 554.72,614.43 542.00,609.88 C517.21,601.02 509.20,599.59 490.00,600.59 C476.15,601.31 462.93,603.76 447.27,608.51 C431.71,613.22 419.16,615.65 403.70,616.94 C384.74,618.51 376.48,618.27 366.94,615.89 C343.64,610.06 329.00,597.14 329.00,582.39 C329.00,577.81 329.37,576.87 332.03,574.63 C335.88,571.39 339.84,570.65 353.50,570.63 C363.75,570.61 365.00,570.83 371.79,573.84 C375.80,575.62 382.55,579.13 386.79,581.63 C393.18,585.40 394.07,585.72 392.00,583.50 C388.02,579.22 370.72,571.33 358.59,568.26 C345.43,564.93 344.74,564.22 341.44,550.58 C335.05,524.12 334.39,502.65 339.39,483.52 C342.37,472.12 342.63,465.08 340.50,453.00 C338.74,442.99 338.55,428.26 340.10,420.80 C341.63,413.39 349.14,397.82 352.41,395.25 C353.91,394.07 358.64,391.97 362.93,390.58 L 370.72 388.06 L 399.11 389.12 C425.58,390.10 428.89,390.44 448.00,394.09 C491.27,402.36 517.07,403.13 541.50,396.87 C558.90,392.41 580.38,378.97 590.86,366.00 C593.30,362.98 595.57,360.40 595.90,360.27 C596.62,359.99 607.93,369.76 617.25,378.73 L 624.00 385.22 L 624.01 398.86 C624.01,414.64 624.94,418.92 629.32,423.51 C631.07,425.34 643.30,434.38 656.50,443.60 C703.55,476.45 706.20,479.17 707.74,496.07 C708.38,503.12 705.99,511.67 701.48,518.47 C697.35,524.69 683.50,538.15 667.00,551.98 C648.41,567.57 642.51,573.50 636.85,582.33 C625.67,599.75 615.81,625.91 613.08,645.35 C612.54,649.20 611.38,653.03 610.42,654.08 C608.88,655.79 599.29,660.00 596.96,660.00 C596.42,660.00 596.00,656.19 596.00,651.25 ZM 404.00 613.96 C416.98,612.36 422.26,611.20 438.00,606.47 C458.72,600.25 459.43,600.10 475.01,598.53 C486.09,597.42 493.63,597.32 510.16,598.08 C533.05,599.12 537.75,599.84 544.82,603.38 C559.05,610.50 578.95,614.82 594.73,614.21 L 605.96 613.78 L 611.38 605.64 C616.52,597.93 634.88,576.81 640.20,572.50 C641.56,571.40 644.82,567.80 647.45,564.50 C650.08,561.20 658.87,551.30 666.99,542.50 C686.52,521.33 688.85,518.48 691.87,512.00 C695.13,505.00 695.29,497.22 692.30,491.50 C689.74,486.62 680.38,477.57 669.00,468.99 C652.93,456.88 639.15,444.97 635.73,440.24 C633.84,437.63 630.77,432.60 628.91,429.07 C626.51,424.51 622.16,419.26 613.97,411.07 C605.17,402.25 601.54,397.80 598.71,392.35 C596.67,388.42 594.98,384.15 594.95,382.85 L 594.90 380.50 L 593.20 383.00 C586.26,393.22 576.03,399.51 560.50,403.09 C553.50,404.71 546.75,405.29 530.14,405.71 C495.07,406.60 462.28,403.81 408.50,395.37 C395.85,393.38 382.39,391.70 378.59,391.63 L 371.67 391.50 L 367.18 399.00 C357.41,415.33 354.68,429.08 357.58,447.50 C360.05,463.22 359.75,474.31 356.52,486.50 C355.06,492.00 353.47,499.42 352.99,503.00 C351.42,514.65 354.21,533.79 360.53,554.63 C363.32,563.85 363.41,563.92 375.85,566.49 C384.19,568.22 394.61,572.15 400.50,575.79 C410.53,581.99 416.94,589.12 415.60,592.59 C414.78,594.75 408.92,594.29 403.72,591.66 L 399.10 589.32 L 398.80 591.91 C398.53,594.24 398.09,594.49 394.38,594.42 C389.98,594.34 384.10,591.70 363.50,580.53 C356.90,576.96 350.76,574.02 349.87,574.02 C346.32,573.98 346.02,584.36 349.36,591.52 C353.99,601.47 365.73,609.34 381.33,612.93 C391.19,615.21 393.11,615.30 404.00,613.96 Z"
              fill="rgba(0,0,0,1)"
            />
          </svg>
        </div>
      ) : (
        <div className="w-[700px] aspect-[391 / 300] relative  overflow-hidden ">
          <svg
            viewBox="328 359 380 302"
            className="flex justify-center items-center"
            style={{ display: "block", background: "transparent" }}
          >
            <defs>
              <clipPath id="frameClip">
                <path d={OUTER_PATH} /> {/* ← single closed path */}
              </clipPath>
            </defs>

            
              <image
                href="/static.gif"
                x="310"
                y="350"
                width="420"
                height="330"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#frameClip)"
                className=""
              />
            

            <path
              d="M 596.00 651.25 C596.01,642.39 599.21,627.36 602.42,621.15 L 603.87 618.35 L 584.50 617.18 C563.16,615.88 554.72,614.43 542.00,609.88 C517.21,601.02 509.20,599.59 490.00,600.59 C476.15,601.31 462.93,603.76 447.27,608.51 C431.71,613.22 419.16,615.65 403.70,616.94 C384.74,618.51 376.48,618.27 366.94,615.89 C343.64,610.06 329.00,597.14 329.00,582.39 C329.00,577.81 329.37,576.87 332.03,574.63 C335.88,571.39 339.84,570.65 353.50,570.63 C363.75,570.61 365.00,570.83 371.79,573.84 C375.80,575.62 382.55,579.13 386.79,581.63 C393.18,585.40 394.07,585.72 392.00,583.50 C388.02,579.22 370.72,571.33 358.59,568.26 C345.43,564.93 344.74,564.22 341.44,550.58 C335.05,524.12 334.39,502.65 339.39,483.52 C342.37,472.12 342.63,465.08 340.50,453.00 C338.74,442.99 338.55,428.26 340.10,420.80 C341.63,413.39 349.14,397.82 352.41,395.25 C353.91,394.07 358.64,391.97 362.93,390.58 L 370.72 388.06 L 399.11 389.12 C425.58,390.10 428.89,390.44 448.00,394.09 C491.27,402.36 517.07,403.13 541.50,396.87 C558.90,392.41 580.38,378.97 590.86,366.00 C593.30,362.98 595.57,360.40 595.90,360.27 C596.62,359.99 607.93,369.76 617.25,378.73 L 624.00 385.22 L 624.01 398.86 C624.01,414.64 624.94,418.92 629.32,423.51 C631.07,425.34 643.30,434.38 656.50,443.60 C703.55,476.45 706.20,479.17 707.74,496.07 C708.38,503.12 705.99,511.67 701.48,518.47 C697.35,524.69 683.50,538.15 667.00,551.98 C648.41,567.57 642.51,573.50 636.85,582.33 C625.67,599.75 615.81,625.91 613.08,645.35 C612.54,649.20 611.38,653.03 610.42,654.08 C608.88,655.79 599.29,660.00 596.96,660.00 C596.42,660.00 596.00,656.19 596.00,651.25 ZM 404.00 613.96 C416.98,612.36 422.26,611.20 438.00,606.47 C458.72,600.25 459.43,600.10 475.01,598.53 C486.09,597.42 493.63,597.32 510.16,598.08 C533.05,599.12 537.75,599.84 544.82,603.38 C559.05,610.50 578.95,614.82 594.73,614.21 L 605.96 613.78 L 611.38 605.64 C616.52,597.93 634.88,576.81 640.20,572.50 C641.56,571.40 644.82,567.80 647.45,564.50 C650.08,561.20 658.87,551.30 666.99,542.50 C686.52,521.33 688.85,518.48 691.87,512.00 C695.13,505.00 695.29,497.22 692.30,491.50 C689.74,486.62 680.38,477.57 669.00,468.99 C652.93,456.88 639.15,444.97 635.73,440.24 C633.84,437.63 630.77,432.60 628.91,429.07 C626.51,424.51 622.16,419.26 613.97,411.07 C605.17,402.25 601.54,397.80 598.71,392.35 C596.67,388.42 594.98,384.15 594.95,382.85 L 594.90 380.50 L 593.20 383.00 C586.26,393.22 576.03,399.51 560.50,403.09 C553.50,404.71 546.75,405.29 530.14,405.71 C495.07,406.60 462.28,403.81 408.50,395.37 C395.85,393.38 382.39,391.70 378.59,391.63 L 371.67 391.50 L 367.18 399.00 C357.41,415.33 354.68,429.08 357.58,447.50 C360.05,463.22 359.75,474.31 356.52,486.50 C355.06,492.00 353.47,499.42 352.99,503.00 C351.42,514.65 354.21,533.79 360.53,554.63 C363.32,563.85 363.41,563.92 375.85,566.49 C384.19,568.22 394.61,572.15 400.50,575.79 C410.53,581.99 416.94,589.12 415.60,592.59 C414.78,594.75 408.92,594.29 403.72,591.66 L 399.10 589.32 L 398.80 591.91 C398.53,594.24 398.09,594.49 394.38,594.42 C389.98,594.34 384.10,591.70 363.50,580.53 C356.90,576.96 350.76,574.02 349.87,574.02 C346.32,573.98 346.02,584.36 349.36,591.52 C353.99,601.47 365.73,609.34 381.33,612.93 C391.19,615.21 393.11,615.30 404.00,613.96 Z"
              fill="rgba(0,0,0,1)"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default Display12;
// import { useEffect, useMemo, useState } from "react";
// import { getWS, sendJSON } from "../../utils/ws";

// const OUTER_PATH =
//   "M 596.00 651.25 C596.01,642.39 599.21,627.36 602.42,621.15 L 603.87 618.35 L 594.73 614.21 C578.95,614.82 559.05,610.50 544.82,603.38 C537.75,599.84 533.05,599.12 510.16,598.08 C493.63,597.32 486.09,597.42 475.01,598.53 C459.43,600.10 458.72,600.25 438.00,606.47 C422.26,611.20 416.98,612.36 404.00,613.96 C393.11,615.30 391.19,615.21 381.33,612.93 C365.73,609.34 353.99,601.47 349.36,591.52 C346.02,584.36 346.32,573.98 349.87,574.02 C350.76,574.02 356.90,576.96 363.50,580.53 C384.10,591.70 389.98,594.34 394.38,594.42 C398.09,594.49 398.53,594.24 398.80,591.91 L 399.10,589.32 L 403.72,591.66 C408.92,594.29 414.78,594.75 415.60,592.59 C416.94,589.12 410.53,581.99 400.50,575.79 C394.61,572.15 384.19,568.22 375.85,566.49 C363.41,563.92 363.32,563.85 360.53,554.63 C354.21,533.79 351.42,514.65 352.99,503.00 C353.47,499.42 355.06,492.00 356.52,486.50 C359.75,474.31 360.05,463.22 357.58,447.50 C354.68,429.08 357.41,415.33 367.18,399.00 L 371.67,391.50 L 378.59,391.63 C382.39,391.70 395.85,393.38 408.50,395.37 C462.28,403.81 495.07,406.60 530.14,405.71 C546.75,405.29 553.50,404.71 560.50,403.09 C576.03,399.51 586.26,393.22 593.20,383.00 L 594.90,380.50 L 594.95,382.85 C594.98,384.15 596.67,388.42 598.71,392.35 C601.54,397.80 605.17,402.25 613.97,411.07 C622.16,419.26 626.51,424.51 628.91,429.07 C630.77,432.60 633.84,437.63 635.73,440.24 C639.15,444.97 652.93,456.88 669.00,468.99 C680.38,477.57 689.74,486.62 692.30,491.50 C695.29,497.22 695.13,505.00 691.87,512.00 C688.85,518.48 686.52,521.33 666.99,542.50 C658.87,551.30 650.08,561.20 647.45,564.50 C644.82,567.80 641.56,571.40 640.20,572.50 C634.88,576.81 616.52,597.93 611.38,605.64 L 605.96,613.78 L 596.00,651.25 Z";

// const displayId = 12;

// // 🎲 Pool of creative prompt templates — {name} is replaced at runtime
// const PROMPT_TEMPLATES = [
//   // Nature & Organic
//   (name) =>
//     `The name "${name}" formed by twisted tree roots and vines growing across an ancient stone wall, moss filling the letters, golden hour lighting, photorealistic, centered composition, wide natural border padding, do not crop`,

//   (name) =>
//     `The name "${name}" written in crashing ocean waves, water frozen mid-splash, each letter made of foam and sea spray, aerial view, photorealistic, 8k resolution, centered with generous negative space`,

//   (name) =>
//     `Aerial view of a forest where the trees are shaped and arranged to spell "${name}", visible only from above, autumn colors, photorealistic, wide shot with breathing room on all sides`,

//   // Elements & Energy
//   (name) =>
//     `The name "${name}" blazing in fire letters floating above dark water, reflections shimmering below, cinematic dramatic lighting, centered composition, full text visible, do not crop`,

//   (name) =>
//     `"${name}" written in lightning bolts across a stormy night sky, purple and white electricity, long exposure photography style, centered with negative space, photorealistic`,

//   (name) =>
//     `The name "${name}" made entirely of glowing galaxies and nebulas, deep space background, NASA Hubble style, centered composition, full letters visible, 8k resolution`,

//   // Urban & Architectural
//   (name) =>
//     `City skyline at night where the skyscrapers are arranged to spell "${name}", neon lights, rain-slicked streets below, cyberpunk aesthetic, aerial perspective, wide composition`,

//   (name) =>
//     `The name "${name}" formed by graffiti murals across the walls of an alleyway, vibrant street art style, urban photography, centered, full text visible with surrounding context`,

//   (name) =>
//     `Vintage neon sign spelling "${name}" flickering on a rainy 1940s street, film noir atmosphere, moody shadows, wide shot, centered composition, do not crop the sign`,

//   // Fantasy & Magical
//   (name) =>
//     `The name "${name}" carved into a glowing crystal cavern wall, bioluminescent light emanating from each letter, fantasy art style, centered, wide view with cave surroundings`,

//   (name) =>
//     `"${name}" written in constellations across a night sky, hand-drawn star map aesthetic, old parchment texture overlay, full sky visible, centered, wide composition`,

//   (name) =>
//     `Fairy lights spelling "${name}" hanging between ancient ruins at twilight, fireflies surrounding the letters, magical realism, wide shot with generous negative space`,

//   // Food & Texture
//   (name) =>
//     `The name "${name}" written in latte art on a perfect cappuccino, top-down view, warm tones, café aesthetic, centered, full cup visible with surrounding table`,

//   (name) =>
//     `"${name}" spelled out with scattered wildflowers on a white marble surface, flat lay style, botanical photography, centered, generous negative space on all sides`,

//   (name) =>
//     `The name "${name}" pressed into freshly baked sourdough bread, rustic wooden table, warm bakery lighting, top-down shot, centered, full loaf visible`,

//   // Cinematic / Abstract
//   (name) =>
//     `A cinematic portrait embodying the essence of the name "${name}", dramatic lighting, rich colors, shallow depth of field, highly detailed, photorealistic, 8k resolution, centered composition with generous negative space`,

//   (name) =>
//     `The name "${name}" sculpted from ice and snow on a frozen tundra, cold blue light, mist rising from the letters, wide aerial shot, photorealistic`,

//   (name) =>
//     `"${name}" formed by golden sand dunes in a vast desert, aerial drone photography, warm sunset light, long shadows, centered, wide composition with sky visible`,
// ];

// const getRandomPrompt = (name) => {
//   const template = PROMPT_TEMPLATES[Math.floor(Math.random() * PROMPT_TEMPLATES.length)];
//   return template(name);
// };

// function Display12() {
//   const ws = useMemo(() => getWS(), []);
//   const [name, setName] = useState("");
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const onOpen = () => {
//       sendJSON(ws, { type: "registerDisplay", displayId });
//     };

//     const onMessage = (event) => {
//       let msg;
//       try {
//         msg = JSON.parse(event.data);
//       } catch {
//         return;
//       }

//       if (msg.type === "newName") {
//         console.log("Received new name:", msg.name);
//         setName(msg.name);
//         generateImage(msg.name);
//       }

//       if (msg.type === "resetDisplay") {
//         setName("");
//       }
//     };

//     if (ws.readyState === WebSocket.OPEN) onOpen();
//     else ws.addEventListener("open", onOpen);

//     ws.addEventListener("message", onMessage);

//     return () => {
//       ws.removeEventListener("open", onOpen);
//       ws.removeEventListener("message", onMessage);
//     };
//   }, [ws]);

//   const generateImage = async (nameToUse) => {
//     if (!nameToUse) {
//       console.log("generateImage called with no name");
//       return;
//     }

//     setLoading(true);
//     setImage(null);

//     const prompt = getRandomPrompt(nameToUse);
//     console.log("Using prompt:", prompt);
// console.log("prompt_used", prompt);
//     try {
//       const response = await fetch(
//         "https://api.getimg.ai/v1/stable-diffusion/text-to-image",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${import.meta.env.VITE_GETIMG_API_KEY}`,
//           },
//           body: JSON.stringify({
//             prompt,
//             width: 896,
//             height: 640,
//             steps: 30,
//           }),
//         }
//       );

//       const data = await response.json();
//       setImage(data.image || data.images?.[0]);
//     } catch (error) {
//       console.error(error);
//     }

//     setLoading(false);
//   };

//   const SVG_PATH = "M 596.00 651.25 C596.01,642.39 599.21,627.36 602.42,621.15 L 603.87 618.35 L 584.50 617.18 C563.16,615.88 554.72,614.43 542.00,609.88 C517.21,601.02 509.20,599.59 490.00,600.59 C476.15,601.31 462.93,603.76 447.27,608.51 C431.71,613.22 419.16,615.65 403.70,616.94 C384.74,618.51 376.48,618.27 366.94,615.89 C343.64,610.06 329.00,597.14 329.00,582.39 C329.00,577.81 329.37,576.87 332.03,574.63 C335.88,571.39 339.84,570.65 353.50,570.63 C363.75,570.61 365.00,570.83 371.79,573.84 C375.80,575.62 382.55,579.13 386.79,581.63 C393.18,585.40 394.07,585.72 392.00,583.50 C388.02,579.22 370.72,571.33 358.59,568.26 C345.43,564.93 344.74,564.22 341.44,550.58 C335.05,524.12 334.39,502.65 339.39,483.52 C342.37,472.12 342.63,465.08 340.50,453.00 C338.74,442.99 338.55,428.26 340.10,420.80 C341.63,413.39 349.14,397.82 352.41,395.25 C353.91,394.07 358.64,391.97 362.93,390.58 L 370.72 388.06 L 399.11 389.12 C425.58,390.10 428.89,390.44 448.00,394.09 C491.27,402.36 517.07,403.13 541.50,396.87 C558.90,392.41 580.38,378.97 590.86,366.00 C593.30,362.98 595.57,360.40 595.90,360.27 C596.62,359.99 607.93,369.76 617.25,378.73 L 624.00 385.22 L 624.01 398.86 C624.01,414.64 624.94,418.92 629.32,423.51 C631.07,425.34 643.30,434.38 656.50,443.60 C703.55,476.45 706.20,479.17 707.74,496.07 C708.38,503.12 705.99,511.67 701.48,518.47 C697.35,524.69 683.50,538.15 667.00,551.98 C648.41,567.57 642.51,573.50 636.85,582.33 C625.67,599.75 615.81,625.91 613.08,645.35 C612.54,649.20 611.38,653.03 610.42,654.08 C608.88,655.79 599.29,660.00 596.96,660.00 C596.42,660.00 596.00,656.19 596.00,651.25 ZM 404.00 613.96 C416.98,612.36 422.26,611.20 438.00,606.47 C458.72,600.25 459.43,600.10 475.01,598.53 C486.09,597.42 493.63,597.32 510.16,598.08 C533.05,599.12 537.75,599.84 544.82,603.38 C559.05,610.50 578.95,614.82 594.73,614.21 L 605.96 613.78 L 611.38 605.64 C616.52,597.93 634.88,576.81 640.20,572.50 C641.56,571.40 644.82,567.80 647.45,564.50 C650.08,561.20 658.87,551.30 666.99,542.50 C686.52,521.33 688.85,518.48 691.87,512.00 C695.13,505.00 695.29,497.22 692.30,491.50 C689.74,486.62 680.38,477.57 669.00,468.99 C652.93,456.88 639.15,444.97 635.73,440.24 C633.84,437.63 630.77,432.60 628.91,429.07 C626.51,424.51 622.16,419.26 613.97,411.07 C605.17,402.25 601.54,397.80 598.71,392.35 C596.67,388.42 594.98,384.15 594.95,382.85 L 594.90 380.50 L 593.20 383.00 C586.26,393.22 576.03,399.51 560.50,403.09 C553.50,404.71 546.75,405.29 530.14,405.71 C495.07,406.60 462.28,403.81 408.50,395.37 C395.85,393.38 382.39,391.70 378.59,391.63 L 371.67 391.50 L 367.18 399.00 C357.41,415.33 354.68,429.08 357.58,447.50 C360.05,463.22 359.75,474.31 356.52,486.50 C355.06,492.00 353.47,499.42 352.99,503.00 C351.42,514.65 354.21,533.79 360.53,554.63 C363.32,563.85 363.41,563.92 375.85,566.49 C384.19,568.22 394.61,572.15 400.50,575.79 C410.53,581.99 416.94,589.12 415.60,592.59 C414.78,594.75 408.92,594.29 403.72,591.66 L 399.10 589.32 L 398.80 591.91 C398.53,594.24 398.09,594.49 394.38,594.42 C389.98,594.34 384.10,591.70 363.50,580.53 C356.90,576.96 350.76,574.02 349.87,574.02 C346.32,573.98 346.02,584.36 349.36,591.52 C353.99,601.47 365.73,609.34 381.33,612.93 C391.19,615.21 393.11,615.30 404.00,613.96 Z";

//   const renderSVG = (children) => (
//     <div className="w-[700px] aspect-[391/300] relative overflow-hidden">
//       <svg
//         viewBox="328 359 380 302"
//         style={{ display: "block", background: "transparent" }}
//       >
//         <defs>
//           <clipPath id="frameClip">
//             <path d={OUTER_PATH} />
//           </clipPath>
//         </defs>
//         {children}
//         <path d={SVG_PATH} fill="rgba(0,0,0,1)" />
//       </svg>
//     </div>
//   );

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-400">
//       {name
//         ? renderSVG(
//             <>
//               {loading && (
//                 <foreignObject x="328" y="359" width="380" height="302">
//                   <div
//                     xmlns="http://www.w3.org/1999/xhtml"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: "black",
//                     }}
//                   >
//                     Generating...
//                   </div>
//                 </foreignObject>
//               )}
//               {image && !loading && (
//                 <image
//                   href={`data:image/png;base64,${image}`}
//                   x="310"
//                   y="350"
//                   width="420"
//                   height="330"
//                   preserveAspectRatio="xMidYMid slice"
//                   clipPath="url(#frameClip)"
//                 />
//               )}
//             </>
//           )
//         : renderSVG(
//             <image
//               href="/static.gif"
//               x="310"
//               y="350"
//               width="420"
//               height="330"
//               preserveAspectRatio="xMidYMid slice"
//               clipPath="url(#frameClip)"
//             />
//           )}
//     </div>
//   );
// }

// export default Display12;