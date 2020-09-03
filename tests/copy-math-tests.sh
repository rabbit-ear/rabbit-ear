# copy the tests/ folder from the math repo (github.com/robbykraft/Math),
# place it inside this tests/ folder and rename it to "math-tests"
# /tests/math-tests/
# run this script

cd math-tests/
# 1. rename "math.core." to "ear.math.", but temporarily call it "earmth."
sed -i 's/math\.core/earmth/g' *
# 2. rename "math." to "ear."
sed -i 's/math\./ear\./g' *
# 3. finish step 1, rename earmth to "ear.math."
sed -i 's/earmth/ear\.math/g' *
# 4. fix the nodejs require include line at the top of every file
sed -i 's/const\ math\ =\ require(.\.\.\/math.);/const\ ear\ =\ require("\.\.\/\.\.\/rabbit-ear");/g' *
