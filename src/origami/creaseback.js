1. we have a new storage: "re:construction"
2. i have the limit of the edge now.
  a. reflect the edge across each face, check for intersections.
  b. even better, limit the fold line to be on the one side of the edge

3. everytime a fold (crease_through_layers), it adds an entry with:
  a. faces_layer at the new flap's faces, so we can find the flap material
  b. re:construction_parameters: edge
