import {
  Atmosphere,
  GlobeKitView,
  PointGlobe,
} from "https://cdn.jsdelivr.net/gh/meetanyway/globekit/globekit.esm.js";

// Api Key from your GlobeKit account
const apiKey =
  "gk_aa9d408894acd715451e6d4ee65a34eb430fb4044e236f857731523137eeecabcd0b5f749792ee3a765b0c4f2b752db761ddabc81be850f9379f7ef4063c5e48";

// Texture object for PointGlobe sparkle/shimmer
const textures = {
  // Clouds.png is availible in assets folder
  noise:
    "https://cdn.jsdelivr.net/gh/meetanyway/globekit/meetanyway/assets/clouds.png",
};

class MyGlobeKit {
  constructor(canvas) {
    /**
     * gkOptions setup some base settings in GlobeKit
     * note: the apiKey and wasmPath settings
     */

    this.gkOptions = {
      apiKey,
      wasmPath: "https://cdn.jsdelivr.net/gh/meetanyway/globekit/gkweb_bg.wasm",
      attributes: {
        alpha: true,
      },
      clearColor: [0.0, 0.0, 0.0, 0.0],
    };

    // Create the GlobeKitView object
    this.gkview = new GlobeKitView(canvas, this.gkOptions);

    // **********************************************************************
    //                   ONSELECTION
    // **********************************************************************
    // onSelection gets called when the globe reports a selection event
    this.gkview.onSelection = (list) => {
      // Uncomment this line to see the list object
      // console.log(list);

      // Iterate over the drawables that reported a selection
      list.drawables.forEach((el) => {
        // This gets run if the points object is selected
        if (el.obj.id === this.pointglobe.id) {
          // Check that selection is valid
          if (el.selection !== undefined) {
            // Create a ripple at the location with duration of 3 seconds
            this.pointglobe.rippleAtLocation(
              el.selection.lat,
              el.selection.lon,
              3000
            );
          }
        } else if (el.obj.id === this.points.id) {
          if (el.selection !== undefined) {
            // Do something with selected point
          }
        }
      });
    };

    // **********************************************************************
    //                   ATMOSPHERES
    // **********************************************************************
    this.atmosphere = new Atmosphere({
      texture:
        "https://cdn.jsdelivr.net/gh/meetanyway/globekit/meetanyway/assets/disk.png",
    });
    this.atmosphere.nScale = 1.02;
    this.gkview.addDrawable(this.atmosphere);

    // **********************************************************************
    //                   POINTGLOBE
    // **********************************************************************
    // Load the binary from static server
    fetch(
      "https://cdn.jsdelivr.net/gh/meetanyway/globekit/meetanyway/assets/pointglobe.bin"
    )
      .then((res) => res.arrayBuffer())
      .then((data) => {
        // Some pointglobe settings
        const pointglobeParams = {
          pointSize: 0.004,
          randomPointSizeVariance: 0.004,
          randomPointSizeRatio: 0.1,
          minPointAlpha: 0.0,
          minPointSize: 0.006,
          color: "#FFFFFF",
        };
        this.pointglobe = new PointGlobe(textures, data, pointglobeParams);
        this.pointglobe.setInteractive(true, true, false);
      })
      .then(() => {
        // Add the drawable, start drawing when it finishes
        this.gkview.addDrawable(this.pointglobe, () => {
          this.gkview.startDrawing();
        });
      });
  }
}

export { MyGlobeKit };
