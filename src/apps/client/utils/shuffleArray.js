
export default function (array) {
    const arrayClone = array.slice();

    let arrayLength = array.length;

    const newArray = [];

    while (arrayLength !== 0) {
        const arr = arrayClone[Math.floor(Math.random() * arrayLength)];

        arrayLength--;

        const index = arrayClone.indexOf(arr);

        arrayClone.splice(index, 1);

        newArray.push(arr);
    }

    return newArray;
}
