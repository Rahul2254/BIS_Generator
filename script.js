let labelGenerated = false;

function generateLabel() {
    // 1. Get Values from Inputs
    const mfgName = document.getElementById('mfg-name').value;
    const address = document.getElementById('address-input').value;
    const prodName = document.getElementById('product-name').value;
    const itemNo = document.getElementById('item-no').value;
    const seriesNo = document.getElementById('series-no').value;
    const commodity = document.getElementById('commodity').value;
    const age = document.getElementById('age').value;
    const unit = document.getElementById('unit').value;
    const batch = document.getElementById('batch').value;
    const mfgDate = document.getElementById('mfg-date').value;
    const mrp = document.getElementById('mrp').value;
    const origin = document.getElementById('origin').value;
    const care = document.getElementById('care').value;
    const fnsku = document.getElementById('fnsku').value;

    // 2. Map Values to Label Text
    document.getElementById('lbl-mfg-name').textContent = mfgName;
    document.getElementById('lbl-address').textContent = address;
    document.getElementById('lbl-product-name').textContent = prodName;
    document.getElementById('lbl-item-no').textContent = itemNo;
    document.getElementById('lbl-series-no').textContent = seriesNo;
    document.getElementById('lbl-commodity').textContent = commodity;
    document.getElementById('lbl-age').textContent = age;
    document.getElementById('lbl-unit').textContent = unit;
    document.getElementById('lbl-batch').textContent = batch;
    document.getElementById('lbl-mfg-date').textContent = mfgDate;
    document.getElementById('lbl-mrp').textContent = mrp;
    document.getElementById('lbl-origin').textContent = origin;
    document.getElementById('lbl-care').textContent = care;
    
    document.getElementById('lbl-fnsku-text').textContent = fnsku;

    // 3. Generate Barcode (Code128 for FNSKU)
    try {
        JsBarcode("#barcode-svg", fnsku, {
            format: "CODE128",
            displayValue: false, // We show the text manually below specifically
            height: 50,
            margin: 0,
            width: 2.5 
        });
        
        labelGenerated = true;
        document.getElementById('download-btn').disabled = false;
    } catch (e) {
        alert("Barcode Error: " + e.message);
    }
}

async function downloadPDF() {
    if (!labelGenerated) return;

    const labelElement = document.getElementById('label-area');
    const { jsPDF } = window.jspdf;

    try {
        // High scale for crisp text on 4x6 label
        const canvas = await html2canvas(labelElement, {
            scale: 3, 
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        
        // PDF Setup: 101mm x 152mm (Portrait)
        const doc = new jsPDF({
            orientation: 'p', 
            unit: 'mm',
            format: [101, 152]
        });

        doc.addImage(imgData, 'PNG', 0, 0, 101, 152);
        
        const fnsku = document.getElementById('fnsku').value || "label";
        doc.save(`Label_${fnsku}.pdf`);

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Failed to download PDF.");
    }
}

// Initial Generation
document.addEventListener('DOMContentLoaded', generateLabel);