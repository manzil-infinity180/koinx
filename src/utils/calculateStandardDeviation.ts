type TData = Array<{price: number}>
export const calculateStandardDeviation = (numbers: TData) => {
    const mean = numbers.reduce((sum, num) => {
        return sum + num.price}, 0) / numbers.length;
    const squaredDifferences = numbers.map(num => Math.pow(num.price - mean, 2))
    const variance = squaredDifferences.reduce((sum, num) => sum + num, 0) / numbers.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation.toFixed(2);
}