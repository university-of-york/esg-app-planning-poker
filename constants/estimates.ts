declare type EstimationScheme = {
    display: string;
    options: string[];
};

declare type EstimationSchemes = Record<string, EstimationScheme>;

const ESTIMATION_SCHEMES: EstimationSchemes = {
    "T-SHIRT": {
        display: "T-shirt sizes",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    FIBONACCI: {
        display: "Fibonacci scale",
        options: ["1", "2", "3", "5", "8", "13", "21"],
    },
    LINEAR: {
        display: "Linear scale",
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
};

export { ESTIMATION_SCHEMES };
