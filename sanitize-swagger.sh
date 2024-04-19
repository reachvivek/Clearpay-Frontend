# Add override in src/api/encoder
find ./src/swagger/encoder.ts -type f -exec sed -i '' -r 's/encodeKey\(k:/override encodeKey\(k:/' {} \;
find ./src/swagger/encoder.ts -type f -exec sed -i '' -r 's/encodeValue\(v:/override encodeValue\(v:/' {} \;