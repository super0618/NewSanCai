export default function (arrayOfIds, arrayOfFeatured) {
    return arrayOfFeatured.sort(function (a, b) {
        return arrayOfIds.indexOf(a._id) - arrayOfIds.indexOf(b._id);
    });
};
