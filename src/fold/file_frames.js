import { clone } from "./object";

export const append_frame = function (fold_file) {

};

export const flatten_frame = function (fold_file, frame_num) {
  if ("file_frames" in fold_file === false
    || fold_file.file_frames.length < frame_num) {
    return fold_file;
  }
  const dontCopy = ["frame_parent", "frame_inherit"];
  const memo = { visited_frames: [] };
  const recurse = function (recurse_fold, frame, orderArray) {
    if (memo.visited_frames.indexOf(frame) !== -1) {
      throw new Error("encountered a cycle in file_frames. can't flatten.");
    }
    memo.visited_frames.push(frame);
    orderArray = [frame].concat(orderArray);
    if (frame === 0) { return orderArray; }
    if (recurse_fold.file_frames[frame - 1].frame_inherit
       && recurse_fold.file_frames[frame - 1].frame_parent != null) {
      return recurse(recurse_fold, recurse_fold.file_frames[frame - 1].frame_parent, orderArray);
    }
    return orderArray;
  };
  return recurse(fold_file, frame_num, []).map((frame) => {
    if (frame === 0) {
      // for frame 0 (the key frame) don't copy over file_frames array
      const swap = fold_file.file_frames;
      fold_file.file_frames = null;
      const copy = clone(fold_file);
      fold_file.file_frames = swap;
      delete copy.file_frames;
      dontCopy.forEach(key => delete copy[key]);
      return copy;
    }
    const outerCopy = clone(fold_file.file_frames[frame - 1]);
    dontCopy.forEach(key => delete outerCopy[key]);
    return outerCopy;
  }).reduce((prev, curr) => Object.assign(prev, curr), {});
};

export const merge_frame = function (fold_file, frame) {
  const dontCopy = ["frame_parent", "frame_inherit"];
  const copy = clone(frame);
  dontCopy.forEach(key => delete copy[key]);
  // don't deep copy file_frames. stash. bring them back.
  const swap = fold_file.file_frames;
  fold_file.file_frames = null;
  const fold = clone(fold_file);
  fold_file.file_frames = swap;
  delete fold.file_frames;
  // merge 2
  Object.assign(fold, frame);
  return fold;
};
