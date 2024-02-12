export default function (previousFeaturesList, itemId, sliceEnd) {
    const newArray = previousFeaturesList;
    newArray.unshift(itemId);
    const slicedArray = newArray.slice(0, sliceEnd || previousFeaturesList.length);
    return slicedArray;
}
