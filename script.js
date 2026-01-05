// We can remove the 'labelGenerated' flag check or keep it just for initial load, 
// but for the download button, we will force generation.

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
            displayValue: false,
            height: 50,
            margin: 0,
            width: 2.5 
        });
        
        // Enable button if it was disabled (though we rely less on this now)
        document.getElementById('download-btn').disabled = false;
    } catch (e) {
        console.error("Barcode Error: " + e.message);
    }
}

async function downloadPDF() {
    // FIX: Force generate label before downloading to get fresh data
    generateLabel(); 

    // Add a small delay to ensure DOM updates (though usually synchronous, barcode SVG might need a tick)
    await new Promise(resolve => setTimeout(resolve, 100));

    const labelElement = document.getElementById('label-area');
    const { jsPDF } = window.jspdf;

    try {
        // Change button text to indicate processing
        const btn = document.getElementById('download-btn');
        const originalText = btn.textContent;
        btn.textContent = "Generating PDF...";
        btn.disabled = true;

        // High scale for crisp text on 4x6 label
        const canvas = await html2canvas(labelElement, {
            scale: 3, 
            useCORS: true,
            backgroundColor: '#ffffff',
            // Ensure we capture the full size even if scrolled out of view
            windowWidth: labelElement.scrollWidth,
            windowHeight: labelElement.scrollHeight
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

        // Reset button
        btn.textContent = originalText;
        btn.disabled = false;

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Failed to download PDF.");
        document.getElementById('download-btn').textContent = "Download PDF";
        document.getElementById('download-btn').disabled = false;
    }
}

// Initial Generation on Load
document.addEventListener('DOMContentLoaded', generateLabel);
