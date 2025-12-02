const express = require('express');
const router = express.Router();

// POST: Calculate load capacity
router.post('/load-capacity', (req, res) => {
    const { area, stress } = req.body;

    if (!area || !stress) {
        return res.status(400).json({
            success: false,
            message: 'Area dan stress harus diisi'
        });
    }

    try {
        const area_num = parseFloat(area);
        const stress_num = parseFloat(stress);

        if (isNaN(area_num) || isNaN(stress_num) || area_num <= 0 || stress_num <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Area dan stress harus berupa angka positif'
            });
        }

        const capacity = area_num * stress_num;
        const safetyFactor = 1.5;
        const maxCapacity = capacity / safetyFactor;

        res.json({
            success: true,
            calculation: {
                area: area_num,
                stress: stress_num,
                capacity: capacity,
                safetyFactor: safetyFactor,
                maxSafeCapacity: maxCapacity
            },
            unit: 'N (Newton)',
            message: `Kapasitas beban maksimal (dengan safety factor ${safetyFactor}): ${maxCapacity.toFixed(2)} N`
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Perhitungan gagal',
            error: err.message
        });
    }
});

// POST: Calculate weight
router.post('/weight', (req, res) => {
    const { length, width, thickness } = req.body;

    if (!length || !width || !thickness) {
        return res.status(400).json({
            success: false,
            message: 'Panjang, lebar, dan tebal harus diisi'
        });
    }

    try {
        const len = parseFloat(length);
        const w = parseFloat(width);
        const t = parseFloat(thickness);

        if (isNaN(len) || isNaN(w) || isNaN(t) || len <= 0 || w <= 0 || t <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Semua dimensi harus berupa angka positif'
            });
        }

        const density = 7.85; // kg/dm³ for steel
        const volume_cm3 = len * 100 * w * t; // convert m and mm to cm
        const volume_dm3 = volume_cm3 / 1000;
        const weight_kg = volume_dm3 * density;

        res.json({
            success: true,
            calculation: {
                length: len,
                width: w,
                thickness: t,
                volume_cm3: volume_cm3,
                density: density,
                weight_kg: weight_kg
            },
            unit: 'kg',
            message: `Berat material: ${weight_kg.toFixed(2)} kg`
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Perhitungan gagal',
            error: err.message
        });
    }
});

// POST: Unit conversion
router.post('/convert', (req, res) => {
    const { value, from, to } = req.body;

    if (!value || !from || !to) {
        return res.status(400).json({
            success: false,
            message: 'Value, from, dan to harus diisi'
        });
    }

    const conversions = {
        'MPa-to-PSI': (v) => v * 145.038,
        'PSI-to-MPa': (v) => v / 145.038,
        'mm2-to-in2': (v) => v * 0.00155,
        'in2-to-mm2': (v) => v / 0.00155,
        'kg/m-to-lb/ft': (v) => v * 0.67197,
        'lb/ft-to-kg/m': (v) => v / 0.67197,
        'C-to-F': (v) => (v * 9/5) + 32,
        'F-to-C': (v) => (v - 32) * 5/9
    };

    const key = `${from}-to-${to}`;
    const converter = conversions[key];

    if (!converter) {
        return res.status(400).json({
            success: false,
            message: `Konversi ${from} ke ${to} tidak didukung`,
            supportedConversions: Object.keys(conversions)
        });
    }

    try {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return res.status(400).json({
                success: false,
                message: 'Value harus berupa angka'
            });
        }

        const result = converter(num);

        res.json({
            success: true,
            calculation: {
                value: num,
                from: from,
                to: to,
                result: result
            },
            message: `${num} ${from} = ${result.toFixed(4)} ${to}`
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Konversi gagal',
            error: err.message
        });
    }
});

// POST: Stress & Strain analysis
router.post('/stress-strain', (req, res) => {
    const { force, area, originalLength, newLength } = req.body;

    if (!force || !area || !originalLength || !newLength) {
        return res.status(400).json({
            success: false,
            message: 'Semua parameter harus diisi'
        });
    }

    try {
        const f = parseFloat(force);
        const a = parseFloat(area);
        const l0 = parseFloat(originalLength);
        const l = parseFloat(newLength);

        if (isNaN(f) || isNaN(a) || isNaN(l0) || isNaN(l) || a <= 0 || l0 <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Parameter harus berupa angka positif'
            });
        }

        const stress = f / a; // MPa
        const strain = (l - l0) / l0; // dimensionless
        const youngModulus = stress / strain;

        res.json({
            success: true,
            calculation: {
                force: f,
                area: a,
                originalLength: l0,
                newLength: l,
                stress: stress,
                strain: strain,
                youngModulus: youngModulus
            },
            units: {
                stress: 'MPa',
                strain: '(dimensionless)',
                youngModulus: 'MPa'
            },
            analysis: {
                stressLevel: stress > 500 ? 'Tinggi' : stress > 250 ? 'Sedang' : 'Rendah',
                message: `Stress: ${stress.toFixed(2)} MPa, Strain: ${(strain * 100).toFixed(2)}%, Young's Modulus: ${youngModulus.toFixed(0)} MPa`
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Analisis gagal',
            error: err.message
        });
    }
});

module.exports = router;
