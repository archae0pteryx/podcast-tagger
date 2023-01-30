// {
//           zoomview: {
//             container: zoomViewRef.current,
//           },
//           overview: {
//             container: overviewRef.current,
//           },
//           mediaElement: audioRef.current,
//           waveformData: {
//             json: WaveformDataJSON as any,
//           },
//         }

export const createConfig = (zoomViewRef, overviewRef, mediaElement) => {
  const config = {
    zoomview: {
      container: zoomViewRef.current,
    },
    overview: {
      container: overviewRef.current,
    },
    mediaElement,
  };
  // return Peaks.init(config);
}
