let chart;


/* =========================
   NAVIGATION
========================= */

function displayHome() {

    document
        .querySelectorAll(".tool-section")
        .forEach(function(section) {
            section.classList.add("hidden");
        });

    document.getElementById("home").style.display =
        "flex";

    window.scrollTo(0, 0);
}


function displayTool(toolId) {

    document.getElementById("home").style.display =
        "none";

    document
        .querySelectorAll(".tool-section")
        .forEach(function(section) {
            section.classList.add("hidden");
        });

    const selectedTool =
        document.getElementById(toolId);

    if (!selectedTool) {

        displayHome();

        return;
    }

    selectedTool.classList.remove("hidden");

    window.scrollTo(0, 0);
}


function showTool(toolId) {

    const newHash =
        "#" + toolId;

    if (
        window.location.hash !==
        newHash
    ) {

        history.pushState(
            {
                tool: toolId
            },
            "",
            newHash
        );
    }

    displayTool(toolId);
}


function showHome() {

    if (!window.location.hash) {

        displayHome();

        return;
    }

    history.pushState(
        {},
        "",
        window.location.pathname
    );

    displayHome();
}


function goHome() {

    if (window.location.hash) {

        history.back();
    }

    else {

        displayHome();
    }
}


window.addEventListener(
    "popstate",
    function() {

        const toolId =
            window.location.hash.replace(
                "#",
                ""
            );

        if (
            toolId &&
            document.getElementById(toolId)
        ) {

            displayTool(toolId);
        }

        else {

            displayHome();
        }
    }
);


function loadPageFromURL() {

    const toolId =
        window.location.hash.replace(
            "#",
            ""
        );

    if (
        toolId &&
        document.getElementById(toolId)
    ) {

        displayTool(toolId);
    }

    else {

        displayHome();
    }
}


/* =========================
   NUMBER FORMATTING
========================= */

function formatNumber(number) {

    if (!Number.isFinite(number)) {

        return "Undefined";
    }


    if (number === 0) {

        return "0";
    }


    const absoluteValue =
        Math.abs(number);


    if (
        absoluteValue >= 1000000 ||
        absoluteValue < 0.0001
    ) {

        return number.toExponential(4);
    }


    return parseFloat(
        number.toFixed(6)
    ).toString();
}


/* =========================
   LINEAR REGRESSION
========================= */

function linearRegression(
    xValues,
    yValues
) {

    const n =
        xValues.length;


    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;


    for (
        let i = 0;
        i < n;
        i++
    ) {

        sumX +=
            xValues[i];

        sumY +=
            yValues[i];

        sumXY +=
            xValues[i] *
            yValues[i];

        sumXX +=
            xValues[i] *
            xValues[i];
    }


    const denominator =
        n * sumXX -
        sumX * sumX;


    if (denominator === 0) {

        return null;
    }


    const slope =
        (
            n * sumXY -
            sumX * sumY
        )
        /
        denominator;


    const intercept =
        (
            sumY -
            slope * sumX
        )
        /
        n;


    const meanY =
        sumY / n;


    let ssTotal = 0;
    let ssResidual = 0;


    for (
        let i = 0;
        i < n;
        i++
    ) {

        const predictedY =
            slope *
            xValues[i] +
            intercept;


        ssTotal +=
            Math.pow(
                yValues[i] -
                meanY,
                2
            );


        ssResidual +=
            Math.pow(
                yValues[i] -
                predictedY,
                2
            );
    }


    let rSquared;


    if (ssTotal === 0) {

        rSquared = 1;
    }

    else {

        rSquared =
            1 -
            ssResidual /
            ssTotal;
    }


    return {

        slope:
            slope,

        intercept:
            intercept,

        rSquared:
            rSquared
    };
}


/* =========================
   GRAPH GENERATOR
========================= */

function generateGraph() {

    const title =
        document
            .getElementById(
                "graph-title"
            )
            .value;


    const xLabel =
        document
            .getElementById(
                "x-label"
            )
            .value;


    const yLabel =
        document
            .getElementById(
                "y-label"
            )
            .value;


    const xText =
        document
            .getElementById(
                "x-values"
            )
            .value
            .trim();


    const yText =
        document
            .getElementById(
                "y-values"
            )
            .value
            .trim();


    if (
        !xText ||
        !yText
    ) {

        alert(
            "Please enter X and Y values."
        );

        return;
    }


    const xValues =
        xText
            .split(",")
            .map(
                value =>
                    Number(
                        value.trim()
                    )
            );


    const yValues =
        yText
            .split(",")
            .map(
                value =>
                    Number(
                        value.trim()
                    )
            );


    const graphType =
        document
            .getElementById(
                "graph-type"
            )
            .value;


    if (
        xValues.length !==
        yValues.length ||
        xValues.length < 2 ||
        xValues.some(isNaN) ||
        yValues.some(isNaN)
    ) {

        alert(
            "Please enter at least two valid X and Y values with the same number of values."
        );

        return;
    }


    const points =
        xValues.map(
            function(
                x,
                index
            ) {

                return {

                    x:
                        x,

                    y:
                        yValues[index]
                };
            }
        );


    if (chart) {

        chart.destroy();
    }


    const datasets =
        [];


    let regression =
        null;


    if (
        graphType ===
        "bar"
    ) {

        datasets.push({

            label:
                title ||
                "Lab Data",

            data:
                yValues,

            borderWidth:
                2
        });
    }

    else {

        datasets.push({

            label:
                "Lab Data",

            data:
                points,

            borderWidth:
                2,

            showLine:
                graphType ===
                "line"
        });


        regression =
            linearRegression(
                xValues,
                yValues
            );


        if (regression) {

            const minX =
                Math.min(
                    ...xValues
                );


            const maxX =
                Math.max(
                    ...xValues
                );


            datasets.push({

                label:
                    "Linear Trendline",

                data: [

                    {

                        x:
                            minX,

                        y:
                            regression.slope *
                            minX +
                            regression.intercept
                    },

                    {

                        x:
                            maxX,

                        y:
                            regression.slope *
                            maxX +
                            regression.intercept
                    }

                ],

                type:
                    "line",

                pointRadius:
                    0,

                borderWidth:
                    2
            });
        }
    }


    const ctx =
        document
            .getElementById(
                "myChart"
            );


    chart =
        new Chart(
            ctx,
            {

                type:
                    graphType,


                data: {

                    datasets:
                        datasets,

                    labels:
                        graphType ===
                        "bar"
                            ? xValues
                            : undefined
                },


                options: {

                    responsive:
                        true,


                    plugins: {

                        title: {

                            display:
                                true,

                            text:
                                title ||
                                "Lab Graph"
                        },


                        legend: {

                            display:
                                graphType !==
                                "bar"
                        }
                    },


                    scales: {

                        x: {

                            type:
                                graphType ===
                                "bar"
                                    ? "category"
                                    : "linear",

                            title: {

                                display:
                                    true,

                                text:
                                    xLabel ||
                                    "X"
                            }
                        },


                        y: {

                            title: {

                                display:
                                    true,

                                text:
                                    yLabel ||
                                    "Y"
                            }
                        }
                    }
                }
            }
        );


    const trendlineDisplay =
        document
            .getElementById(
                "trendline-results"
            );


    const explanationBox =
        document
            .getElementById(
                "graph-explanation"
            );


    const downloadButton =
        document
            .getElementById(
                "download-graph-button"
            );


    downloadButton.classList.remove(
        "hidden"
    );


    if (
        graphType === "bar" ||
        !regression
    ) {

        trendlineDisplay.innerHTML =
            "";

        explanationBox.classList.add(
            "hidden"
        );

        return;
    }


    const sign =
        regression.intercept >= 0
            ? "+"
            : "-";


    const equation =
        "y = " +
        formatNumber(
            regression.slope
        ) +
        "x " +
        sign +
        " " +
        formatNumber(
            Math.abs(
                regression.intercept
            )
        );


    trendlineDisplay.innerHTML =
        "Trendline Equation: " +
        equation +
        "<br>R² = " +
        formatNumber(
            regression.rSquared
        );


    explanationBox.classList.remove(
        "hidden"
    );
}


/* =========================
   DOWNLOAD GRAPH
========================= */

function downloadGraph() {

    if (!chart) {

        alert(
            "Generate a graph first."
        );

        return;
    }


    const link =
        document.createElement(
            "a"
        );


    link.download =
        "scitools-graph.png";


    link.href =
        chart.toBase64Image();


    link.click();
}


/* =========================
   STATISTICS
========================= */

function getNumberList(
    inputId
) {

    const text =
        document
            .getElementById(
                inputId
            )
            .value
            .trim();


    if (!text) {

        return null;
    }


    const numbers =
        text
            .split(",")
            .map(
                value =>
                    Number(
                        value.trim()
                    )
            );


    if (
        numbers.length === 0 ||
        numbers.some(isNaN)
    ) {

        return null;
    }


    return numbers;
}


function calculateStatistics() {

    const numbers =
        getNumberList(
            "stats-values"
        );


    if (!numbers) {

        alert(
            "Please enter valid numbers separated by commas."
        );

        return;
    }


    const sdType =
        document
            .querySelector(
                'input[name="sd-type"]:checked'
            )
            .value;


    if (
        sdType === "sample" &&
        numbers.length < 2
    ) {

        alert(
            "Sample standard deviation requires at least two values."
        );

        return;
    }


    const sum =
        numbers.reduce(
            (
                total,
                value
            ) =>
                total +
                value,
            0
        );


    const mean =
        sum /
        numbers.length;


    const sorted =
        [...numbers].sort(
            (
                a,
                b
            ) =>
                a - b
        );


    let median;


    if (
        sorted.length %
        2 === 0
    ) {

        const middle =
            sorted.length /
            2;


        median =
            (
                sorted[
                    middle - 1
                ] +
                sorted[
                    middle
                ]
            )
            /
            2;
    }

    else {

        median =
            sorted[
                Math.floor(
                    sorted.length /
                    2
                )
            ];
    }


    const range =
        Math.max(
            ...numbers
        )
        -
        Math.min(
            ...numbers
        );


    const squaredDifferenceSum =
        numbers.reduce(
            (
                total,
                value
            ) =>
                total +
                Math.pow(
                    value -
                    mean,
                    2
                ),
            0
        );


    const divisor =
        sdType ===
        "sample"
            ? numbers.length - 1
            : numbers.length;


    const variance =
        squaredDifferenceSum /
        divisor;


    const standardDeviation =
        Math.sqrt(
            variance
        );


    document
        .getElementById(
            "mean-result"
        )
        .textContent =
        formatNumber(
            mean
        );


    document
        .getElementById(
            "median-result"
        )
        .textContent =
        formatNumber(
            median
        );


    document
        .getElementById(
            "range-result"
        )
        .textContent =
        formatNumber(
            range
        );


    document
        .getElementById(
            "sd-result"
        )
        .textContent =
        formatNumber(
            standardDeviation
        );


    document
        .getElementById(
            "stats-results"
        )
        .classList
        .remove(
            "hidden"
        );
}


/* =========================
   PERCENT ERROR
========================= */

function calculatePercentError() {

    const experimentalInput =
        document
            .getElementById(
                "experimental-value"
            )
            .value;


    const acceptedInput =
        document
            .getElementById(
                "accepted-value"
            )
            .value;


    if (
        experimentalInput === "" ||
        acceptedInput === ""
    ) {

        alert(
            "Please enter both values."
        );

        return;
    }


    const experimental =
        Number(
            experimentalInput
        );


    const accepted =
        Number(
            acceptedInput
        );


    if (
        !Number.isFinite(
            experimental
        ) ||
        !Number.isFinite(
            accepted
        ) ||
        accepted === 0
    ) {

        alert(
            "Please enter valid values. Accepted value cannot be zero."
        );

        return;
    }


    const percentError =
        Math.abs(
            experimental -
            accepted
        )
        /
        Math.abs(
            accepted
        )
        *
        100;


    const result =
        document
            .getElementById(
                "error-result"
            );


    result.textContent =
        "Percent Error = " +
        formatNumber(
            percentError
        ) +
        "%";


    result.classList.remove(
        "hidden"
    );
}


/* =========================
   PERCENT DIFFERENCE
========================= */

function calculatePercentDifference() {

    const inputOne =
        document
            .getElementById(
                "difference-value-one"
            )
            .value;


    const inputTwo =
        document
            .getElementById(
                "difference-value-two"
            )
            .value;


    if (
        inputOne === "" ||
        inputTwo === ""
    ) {

        alert(
            "Please enter both values."
        );

        return;
    }


    const valueOne =
        Number(
            inputOne
        );


    const valueTwo =
        Number(
            inputTwo
        );


    if (
        !Number.isFinite(
            valueOne
        ) ||
        !Number.isFinite(
            valueTwo
        )
    ) {

        alert(
            "Please enter two valid values."
        );

        return;
    }


    const average =
        (
            Math.abs(
                valueOne
            )
            +
            Math.abs(
                valueTwo
            )
        )
        /
        2;


    if (average === 0) {

        alert(
            "Percent difference is undefined when both values are zero."
        );

        return;
    }


    const percentDifference =
        Math.abs(
            valueOne -
            valueTwo
        )
        /
        average
        *
        100;


    const result =
        document
            .getElementById(
                "difference-result"
            );


    result.textContent =
        "Percent Difference = " +
        formatNumber(
            percentDifference
        ) +
        "%";


    result.classList.remove(
        "hidden"
    );
}


/* =========================
   UNIT CONVERTER
========================= */

const converterUnits = {

    length: {

        mm: {
            name:
                "Millimeters (mm)",
            factor:
                0.001
        },

        cm: {
            name:
                "Centimeters (cm)",
            factor:
                0.01
        },

        m: {
            name:
                "Meters (m)",
            factor:
                1
        },

        km: {
            name:
                "Kilometers (km)",
            factor:
                1000
        }
    },


    mass: {

        mg: {
            name:
                "Milligrams (mg)",
            factor:
                0.001
        },

        g: {
            name:
                "Grams (g)",
            factor:
                1
        },

        kg: {
            name:
                "Kilograms (kg)",
            factor:
                1000
        }
    },


    volume: {

        uL: {
            name:
                "Microliters (µL)",
            factor:
                0.001
        },

        mL: {
            name:
                "Milliliters (mL)",
            factor:
                1
        },

        L: {
            name:
                "Liters (L)",
            factor:
                1000
        },

        cm3: {
            name:
                "Cubic Centimeters (cm³)",
            factor:
                1
        }
    },


    time: {

        ms: {
            name:
                "Milliseconds (ms)",
            factor:
                0.001
        },

        s: {
            name:
                "Seconds (s)",
            factor:
                1
        },

        min: {
            name:
                "Minutes (min)",
            factor:
                60
        },

        h: {
            name:
                "Hours (h)",
            factor:
                3600
        }
    },


    speed: {

        ms: {
            name:
                "Meters per second (m/s)",
            factor:
                1
        },

        kmh: {
            name:
                "Kilometers per hour (km/h)",
            factor:
                1 / 3.6
        },

        cms: {
            name:
                "Centimeters per second (cm/s)",
            factor:
                0.01
        }
    },


    temperature: {

        C: {
            name:
                "Celsius (°C)"
        },

        F: {
            name:
                "Fahrenheit (°F)"
        },

        K: {
            name:
                "Kelvin (K)"
        }
    }
};


function updateConverterUnits() {

    const category =
        document
            .getElementById(
                "conversion-category"
            )
            .value;


    const fromSelect =
        document
            .getElementById(
                "from-unit"
            );


    const toSelect =
        document
            .getElementById(
                "to-unit"
            );


    fromSelect.innerHTML =
        "";

    toSelect.innerHTML =
        "";


    const units =
        converterUnits[
            category
        ];


    Object
        .keys(
            units
        )
        .forEach(
            function(
                unitKey
            ) {

                const fromOption =
                    document
                        .createElement(
                            "option"
                        );


                fromOption.value =
                    unitKey;


                fromOption.textContent =
                    units[
                        unitKey
                    ].name;


                fromSelect.appendChild(
                    fromOption
                );


                const toOption =
                    document
                        .createElement(
                            "option"
                        );


                toOption.value =
                    unitKey;


                toOption.textContent =
                    units[
                        unitKey
                    ].name;


                toSelect.appendChild(
                    toOption
                );
            }
        );


    if (
        toSelect.options.length >
        1
    ) {

        toSelect.selectedIndex =
            1;
    }


    document
        .getElementById(
            "conversion-result"
        )
        .classList
        .add(
            "hidden"
        );
}


function convertTemperature(
    value,
    fromUnit,
    toUnit
) {

    let celsius;


    if (
        fromUnit ===
        "C"
    ) {

        celsius =
            value;
    }

    else if (
        fromUnit ===
        "F"
    ) {

        celsius =
            (
                value -
                32
            )
            *
            5 / 9;
    }

    else {

        celsius =
            value -
            273.15;
    }


    if (
        toUnit ===
        "C"
    ) {

        return celsius;
    }


    if (
        toUnit ===
        "F"
    ) {

        return (
            celsius *
            9 / 5
            +
            32
        );
    }


    return (
        celsius +
        273.15
    );
}


function convertUnit() {

    const input =
        document
            .getElementById(
                "converter-value"
            )
            .value;


    if (
        input ===
        ""
    ) {

        alert(
            "Please enter a value."
        );

        return;
    }


    const value =
        Number(
            input
        );


    if (
        !Number.isFinite(
            value
        )
    ) {

        alert(
            "Please enter a valid number."
        );

        return;
    }


    const category =
        document
            .getElementById(
                "conversion-category"
            )
            .value;


    const fromUnit =
        document
            .getElementById(
                "from-unit"
            )
            .value;


    const toUnit =
        document
            .getElementById(
                "to-unit"
            )
            .value;


    let convertedValue;


    if (
        category ===
        "temperature"
    ) {

        convertedValue =
            convertTemperature(
                value,
                fromUnit,
                toUnit
            );
    }

    else {

        const fromFactor =
            converterUnits[
                category
            ][
                fromUnit
            ].factor;


        const toFactor =
            converterUnits[
                category
            ][
                toUnit
            ].factor;


        const baseValue =
            value *
            fromFactor;


        convertedValue =
            baseValue /
            toFactor;
    }


    const result =
        document
            .getElementById(
                "conversion-result"
            );


    const fromName =
        converterUnits[
            category
        ][
            fromUnit
        ].name;


    const toName =
        converterUnits[
            category
        ][
            toUnit
        ].name;


    result.innerHTML =
        "<span>" +
        value +
        " " +
        fromName +
        "</span>" +

        "<strong>" +
        formatNumber(
            convertedValue
        ) +
        " " +
        toName +
        "</strong>";


    result.classList.remove(
        "hidden"
    );
}


/* =========================
   LAB COACH:
   EXPERIMENT PLAN
========================= */

function buildExperimentPlan() {

    const question =
        document
            .getElementById(
                "research-question"
            )
            .value
            .trim();


    const independent =
        document
            .getElementById(
                "independent-variable"
            )
            .value
            .trim();


    const dependent =
        document
            .getElementById(
                "dependent-variable"
            )
            .value
            .trim();


    const ivUnits =
        document
            .getElementById(
                "iv-units"
            )
            .value
            .trim();


    const dvUnits =
        document
            .getElementById(
                "dv-units"
            )
            .value
            .trim();


    const controls =
        document
            .getElementById(
                "controlled-variables"
            )
            .value
            .trim();


    const hypothesis =
        document
            .getElementById(
                "hypothesis"
            )
            .value
            .trim();


    if (
        !question ||
        !independent ||
        !dependent
    ) {

        alert(
            "Add a research question, independent variable, and dependent variable first."
        );

        return;
    }


    const independentDisplay =
        ivUnits
            ? independent +
              " (" +
              ivUnits +
              ")"
            : independent;


    const dependentDisplay =
        dvUnits
            ? dependent +
              " (" +
              dvUnits +
              ")"
            : dependent;


    const controlsDisplay =
        controls ||
        "Not added yet";


    const hypothesisDisplay =
        hypothesis ||
        "Not added yet";


    const output =
        document
            .getElementById(
                "experiment-plan-text"
            );


    output.innerHTML =

        '<div class="outline-item">' +
            '<span>Research Question</span>' +
            '<p>' +
                escapeHTML(
                    question
                ) +
            '</p>' +
        '</div>' +

        '<div class="outline-item">' +
            '<span>Independent Variable</span>' +
            '<p>' +
                escapeHTML(
                    independentDisplay
                ) +
            '</p>' +
        '</div>' +

        '<div class="outline-item">' +
            '<span>Dependent Variable</span>' +
            '<p>' +
                escapeHTML(
                    dependentDisplay
                ) +
            '</p>' +
        '</div>' +

        '<div class="outline-item">' +
            '<span>Controlled Variables</span>' +
            '<p>' +
                escapeHTML(
                    controlsDisplay
                ) +
            '</p>' +
        '</div>' +

        '<div class="outline-item">' +
            '<span>Hypothesis</span>' +
            '<p>' +
                escapeHTML(
                    hypothesisDisplay
                ) +
            '</p>' +
        '</div>';


    document
        .getElementById(
            "experiment-plan-output"
        )
        .classList
        .remove(
            "hidden"
        );
}


function copyExperimentPlan() {

    const element =
        document
            .getElementById(
                "experiment-plan-text"
            );


    copyElementText(
        element,
        "Experiment plan copied."
    );
}


/* =========================
   LAB COACH:
   GRAPH RECOMMENDER
========================= */

function recommendGraph() {

    const ivType =
        document
            .getElementById(
                "iv-data-type"
            )
            .value;


    const dvType =
        document
            .getElementById(
                "dv-data-type"
            )
            .value;


    if (
        !ivType ||
        !dvType
    ) {

        alert(
            "Choose both variable types first."
        );

        return;
    }


    let title =
        "";

    let explanation =
        "";


    if (
        ivType === "time" &&
        dvType === "numerical"
    ) {

        title =
            "Line Graph";

        explanation =
            "A line graph is useful when the independent variable follows an ordered progression such as time. Connecting the points helps show how the measured value changes across that progression.";
    }

    else if (
        ivType === "continuous" &&
        dvType === "numerical"
    ) {

        title =
            "Scatter Plot";

        explanation =
            "A scatter plot is usually appropriate when both variables are numerical. It lets you examine the relationship between them and, when appropriate, add a trendline.";
    }

    else if (
        ivType === "categorical" &&
        dvType === "numerical"
    ) {

        title =
            "Bar Graph";

        explanation =
            "A bar graph is useful when comparing numerical measurements across separate categories or treatment groups.";
    }

    else {

        title =
            "Bar Graph of Counts or Percentages";

        explanation =
            "When the results are categories rather than continuous measurements, summarize the number or percentage in each category and compare those values with bars.";
    }


    const output =
        document
            .getElementById(
                "graph-recommendation"
            );


    output.innerHTML =

        '<div class="recommendation-result">' +

            '<span>Recommended</span>' +

            '<h4>' +
                title +
            '</h4>' +

            '<p>' +
                explanation +
            '</p>' +

            '<button class="small-action-button" onclick="showTool(\'graph-tool\')">' +
                'Open Graphing Tool →' +
            '</button>' +

        '</div>';


    output.classList.remove(
        "hidden"
    );
}


/* =========================
   LAB COACH:
   CONCLUSION OUTLINE
========================= */

function buildConclusionOutline() {

    const claim =
        document
            .getElementById(
                "conclusion-claim"
            )
            .value
            .trim();


    const evidence =
        document
            .getElementById(
                "conclusion-evidence"
            )
            .value
            .trim();


    const reasoning =
        document
            .getElementById(
                "conclusion-reasoning"
            )
            .value
            .trim();


    const limitation =
        document
            .getElementById(
                "conclusion-limitation"
            )
            .value
            .trim();


    const improvement =
        document
            .getElementById(
                "conclusion-improvement"
            )
            .value
            .trim();


    if (
        !claim &&
        !evidence &&
        !reasoning &&
        !limitation &&
        !improvement
    ) {

        alert(
            "Add some information to your conclusion first."
        );

        return;
    }


    const output =
        document
            .getElementById(
                "conclusion-output-text"
            );


    output.innerHTML =

        makeOutlineItem(
            "1. Claim",
            claim,
            "Add a clear answer to the research question."
        ) +

        makeOutlineItem(
            "2. Evidence",
            evidence,
            "Add specific measurements, trends, averages, or graph results."
        ) +

        makeOutlineItem(
            "3. Scientific Reasoning",
            reasoning,
            "Explain the scientific concept that connects your evidence to your claim."
        ) +

        makeOutlineItem(
            "4. Limitation",
            limitation,
            "Identify a specific limitation or source of error and its possible effect."
        ) +

        makeOutlineItem(
            "5. Improvement",
            improvement,
            "Suggest a specific change that addresses the limitation."
        );


    document
        .getElementById(
            "conclusion-output"
        )
        .classList
        .remove(
            "hidden"
        );
}


function makeOutlineItem(
    title,
    value,
    missingText
) {

    const hasValue =
        value.length > 0;


    return (

        '<div class="outline-item ' +
        (
            hasValue
                ? "complete-item"
                : "missing-item"
        ) +
        '">' +

            '<span>' +
                title +
            '</span>' +

            '<p>' +
                escapeHTML(
                    hasValue
                        ? value
                        : missingText
                ) +
            '</p>' +

        '</div>'
    );
}


function copyConclusionOutline() {

    const element =
        document
            .getElementById(
                "conclusion-output-text"
            );


    copyElementText(
        element,
        "Conclusion outline copied."
    );
}


/* =========================
   FEEDBACK FORM
========================= */

const feedbackEndpoint =
    "https://formspree.io/f/mgaonrgy";


function updateFeedbackCount() {

    const message =
        document
            .getElementById(
                "feedback-message"
            );


    const count =
        document
            .getElementById(
                "feedback-character-count"
            );


    count.textContent =
        message.value.length;
}


async function submitFeedback(event) {

    event.preventDefault();


    const form =
        document
            .getElementById(
                "feedback-form"
            );


    const type =
        document
            .getElementById(
                "feedback-type"
            )
            .value;


    const message =
        document
            .getElementById(
                "feedback-message"
            )
            .value
            .trim();


    const submitButton =
        document
            .getElementById(
                "feedback-submit-button"
            );


    const status =
        document
            .getElementById(
                "feedback-status"
            );


    if (!type) {

        showFeedbackStatus(
            "Choose a feedback type first.",
            "error"
        );

        return;
    }


    if (!message) {

        showFeedbackStatus(
            "Please write a message before submitting.",
            "error"
        );

        return;
    }


    if (message.length < 5) {

        showFeedbackStatus(
            "Please add a little more detail before submitting.",
            "error"
        );

        return;
    }


    const formData =
        new FormData(form);


    formData.append(
        "page_url",
        window.location.href
    );


    submitButton.disabled =
        true;


    submitButton.textContent =
        "Sending...";


    status.classList.add(
        "hidden"
    );


    try {

        const response =
            await fetch(
                feedbackEndpoint,
                {

                    method:
                        "POST",

                    body:
                        formData,

                    headers: {

                        Accept:
                            "application/json"
                    }
                }
            );


        if (response.ok) {

            form.reset();


            updateFeedbackCount();


            form.style.display =
                "none";


            document
                .querySelector(
                    ".feedback-side-panel"
                )
                .style.display =
                "none";


            document
                .getElementById(
                    "feedback-success"
                )
                .classList
                .remove(
                    "hidden"
                );


            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );
        }

        else {

            let errorMessage =
                "Something went wrong while sending your feedback. Please try again.";


            try {

                const data =
                    await response.json();


                if (
                    data.errors &&
                    data.errors.length > 0
                ) {

                    errorMessage =
                        data.errors
                            .map(
                                error =>
                                    error.message
                            )
                            .join(" ");
                }
            }

            catch (error) {

                // Keep the normal error message.
            }


            showFeedbackStatus(
                errorMessage,
                "error"
            );
        }
    }

    catch (error) {

        showFeedbackStatus(
            "The feedback could not be sent. Check your internet connection and try again.",
            "error"
        );
    }

    finally {

        submitButton.disabled =
            false;


        submitButton.textContent =
            "Submit Feedback";
    }
}


function showFeedbackStatus(
    message,
    type
) {

    const status =
        document
            .getElementById(
                "feedback-status"
            );


    status.textContent =
        message;


    status.classList.remove(
        "hidden",
        "status-error",
        "status-success"
    );


    if (
        type ===
        "error"
    ) {

        status.classList.add(
            "status-error"
        );
    }

    else {

        status.classList.add(
            "status-success"
        );
    }
}


function resetFeedbackForm() {

    const form =
        document
            .getElementById(
                "feedback-form"
            );


    const sidePanel =
        document
            .querySelector(
                ".feedback-side-panel"
            );


    form.reset();


    form.style.display =
        "block";


    sidePanel.style.display =
        "block";


    document
        .getElementById(
            "feedback-success"
        )
        .classList
        .add(
            "hidden"
        );


    document
        .getElementById(
            "feedback-status"
        )
        .classList
        .add(
            "hidden"
        );


    updateFeedbackCount();
}


/* =========================
   COPY HELPERS
========================= */

function copyElementText(
    element,
    successMessage
) {

    const text =
        element.innerText;


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(
                text
            )
            .then(
                function() {

                    alert(
                        successMessage
                    );
                }
            )
            .catch(
                function() {

                    fallbackCopyText(
                        text,
                        successMessage
                    );
                }
            );
    }

    else {

        fallbackCopyText(
            text,
            successMessage
        );
    }
}


function fallbackCopyText(
    text,
    successMessage
) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    document.execCommand(
        "copy"
    );


    textarea.remove();


    alert(
        successMessage
    );
}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;
}


/* =========================
   INITIAL SETUP
========================= */

updateConverterUnits();

updateFeedbackCount();

loadPageFromURL();