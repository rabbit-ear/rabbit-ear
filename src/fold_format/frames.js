import { clone } from "./object";

export const append_frame = function(fold_file) {

}

export const flatten_frame = function(fold_file, frame_num){
  if ("file_frames" in fold_file === false ||
    fold_file.file_frames.length < frame_num) {
    return fold_file;
  }
  const dontCopy = ["frame_parent", "frame_inherit"];
  var memo = {visited_frames:[]};
  function recurse(fold_file, frame, orderArray) {
    if (memo.visited_frames.indexOf(frame) !== -1) {
      throw "encountered a cycle in the file_frames tree. can't flatten frame.";
      return orderArray;
    }
    memo.visited_frames.push(frame);
    orderArray = [frame].concat(orderArray);
    if (frame === 0) { return orderArray; }
    if (fold_file.file_frames[frame - 1].frame_inherit &&
       fold_file.file_frames[frame - 1].frame_parent != null) {
      return recurse(fold_file, fold_file.file_frames[frame - 1].frame_parent, orderArray);
    }
    return orderArray;
  }
  return recurse(fold_file, frame_num, []).map(frame => {
    if (frame === 0) {
      // for frame 0 (the key frame) don't copy over file_frames array
      let swap = fold_file.file_frames;
      fold_file.file_frames = null;
      let copy = clone(fold_file);
      fold_file.file_frames = swap;
      delete copy.file_frames;
      dontCopy.forEach(key => delete copy[key]);
      return copy;
    }
    let copy = clone(fold_file.file_frames[frame-1]);
    dontCopy.forEach(key => delete copy[key]);
    return copy;
  }).reduce((prev,curr) => Object.assign(prev,curr),{})
};

export const merge_frame = function(fold_file, frame){
  const dontCopy = ["frame_parent", "frame_inherit"];
  let copy = clone(frame);
  dontCopy.forEach(key => delete copy[key]);
  // don't deep copy file_frames. stash. bring them back.
  let swap = fold_file.file_frames;
  fold_file.file_frames = null;
  let fold = clone(fold_file);
  fold_file.file_frames = swap;
  delete fold.file_frames;
  // merge 2
  Object.assign(fold, frame);
  return fold;
};
