const policy = trustedTypes.createPolicy("loadJsPDF", {
    createScriptURL: url => url
});

const script = document.createElement("script");
script.src = policy.createScriptURL(
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
);

script.onload = function () {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        unit: "px",
        format: [800, 1000]
    });

    const imgs = document.querySelectorAll("img");

    imgs.forEach((img, index) => {
        if (!img.src.startsWith("blob:")) return;

        const w = img.naturalWidth;
        const h = img.naturalHeight;

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        const data = canvas.toDataURL("image/jpeg", 1.0);

        const scale = Math.min(800 / w, 1000 / h);
        const drawW = w * scale;
        const drawH = h * scale;

        const x = (800 - drawW) / 2;
        const y = (1000 - drawH) / 2;

        pdf.addImage(data, "JPEG", x, y, drawW, drawH);

        if (index < imgs.length - 1) {
            pdf.addPage([800, 1000]);
        }
    });

    pdf.save("download.pdf");
};

document.body.appendChild(script);

