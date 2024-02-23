const getArrayChunks = (array, chunks) => {
    return array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunks);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);
};

export default getArrayChunks;
