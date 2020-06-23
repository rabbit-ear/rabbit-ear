import graphProto from "./graph/prototype";
import cpProto from "./cp/prototype";

// the root object. including the prototype
export default Object.assign(
  Object.create({
    __prototypes__: {
      graph: graphProto,
      cp: cpProto,
      // origami: origamiProto,
    }
  })
);

// export default {};
