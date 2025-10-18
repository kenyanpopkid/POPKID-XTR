const path = require("path");
const os = require('os');
const fsP = require('fs');
const fs = require('fs').promises;
const { downloadContentFromMessage } = require('gifted-baileys');
const { Readable } = require('stream');
const FormData = require('form-data');
const axios = require('axios');
const { Blob } = require('buffer');


function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

async function getMediaBuffer(message, type) {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

function getFileContentType(ext) {
    const types = {
        // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  
  // Videos
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.flv': 'video/x-flv',
  
  // Audio
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.flac': 'audio/flac',
  
  // Documents
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  
  // Archives
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.7z': 'application/x-7z-compressed',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip',
  
  // Code
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.html': 'text/html',
  '.css': 'text/css',
  '.php': 'application/x-httpd-php',
  '.py': 'text/x-python',
  '.java': 'text/x-java-source',
  '.c': 'text/x-csrc',
  '.cpp': 'text/x-c++src',
  '.h': 'text/x-chdr',
  
  // Other
  '.vcf': 'text/vcard',
  '.md': 'text/markdown',
  '.xml': 'application/xml',
  '.exe': 'application/x-msdownload',
  '.apk': 'application/vnd.android.package-archive',
  '.iso': 'application/x-iso9660-image',
  
  // Default
  '': 'application/octet-stream'
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
}


async function uploadToGithubCdn(buffer, filename) {
    const form = new FormData();
    const stream = bufferToStream(buffer);
    
    form.append('file', stream, {
        filename: filename,
        contentType: getFileContentType(path.extname(filename))
    });

    const { data } = await axios.post('https://ghbcdn.giftedtech.co.ke/api/upload.php', form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    });

    return { url: data.rawUrl || data };
}


async function uploadToGiftedCdn(buffer, filename, deleteKey = '') {
    const form = new FormData();
    const stream = bufferToStream(buffer);
    
    form.append('file', stream, {
        filename: filename,
        contentType: getFileContentType(path.extname(filename))
    });
    
    if (deleteKey) {
        form.append('deleteKey', deleteKey);
    }

    const { data } = await axios.post('https://cdn.giftedtech.co.ke/api/upload.php', form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    });

    return { url: data.url || data };
}


async function uploadToCatbox(buffer, filename) {
    const form = new FormData();
    const stream = bufferToStream(buffer);
    form.append('reqtype', 'fileupload');
    form.append('userhash', 'ae78e7174c674f133a271261b');
    form.append('fileToUpload', stream, {
        filename: filename,
        contentType: getFileContentType(path.extname(filename))
    });

    const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    });

    return { url: data.trim() };
}


async function uploadToPixhost(buffer, filename) {
    const { fileTypeFromBuffer } = await import('file-type');
    const type = await fileTypeFromBuffer(buffer);
    const ext = type?.ext || path.extname(filename).replace('.', '');
    
    const form = new FormData();
    const stream = bufferToStream(buffer);
    form.append('img', stream, {
        filename: `image.${ext}`,
        contentType: type?.mime || getFileContentType(`.${ext}`)
    });
    form.append('content_type', '0');

    const { data } = await axios.post('https://api.pixhost.to/images', form, {
        headers: {
            ...form.getHeaders(),
            'Accept': 'application/json'
        }
    });
    const { data: html } = await axios.get(data.show_url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    const regex = html.match(/id="image"[^>]*class="image-img"[^>]*src="([^"]*)"/);
    if (!regex || !regex[1]) {
        throw new Error("Failed to get image URL from Pixhost");
    }

    return { url: regex[1] };
}


async function uploadToImgBB(buffer, filename) {
    const form = new FormData();
    const stream = bufferToStream(buffer);
    form.append('image', stream, {
        filename: filename,
        contentType: getFileContentType(path.extname(filename))
    });

    const { data } = await axios.post(
        'https://api.imgbb.com/1/upload?key=bbc0c59714520ebcd0af58caf995bd08',
        form,
        {
            headers: form.getHeaders()
        }
    );

    return { url: data.data.url };
}


async function uploadToPasteboard(buffer, filename) {
    const { fileTypeFromBuffer } = await import('file-type');
    const type = await fileTypeFromBuffer(buffer);
    const ext = type?.ext || path.extname(filename).replace('.', '');
    const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}.${ext}`);
    await fs.writeFile(tempFilePath, buffer);
    
    try {
        const form = new FormData();
        form.append('file', fsP.createReadStream(tempFilePath), {
            filename: filename,
            contentType: type?.mime || getFileContentType(`.${ext}`)
        });
        form.append('cb', '173');  

        const contentLength = await new Promise((resolve, reject) => {
            form.getLength((err, length) => {
                if (err) reject(err);
                else resolve(length);
            });
        });

        const { data } = await axios.post('https://pasteboard.co/upload', form, {
            headers: {
                ...form.getHeaders(),
                'Connection': 'keep-alive',
                'Content-Length': contentLength.toString(),
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryoEMJPAYdWGkV65jv',
                'Host': 'pasteboard.co',
                'Cookie': `pb_${filename}=JOe3yowJg3NFDxCHVxj5IzIxroeMybkaQts054zYXMKYN%2FIizS6uqoUbrQKAiXC6mQQlL%2F3Ia11PJZbP3Zw6Cw; pb_${filename}=n7MEl6IZlPiBReTeGFOHMmDxzcZ4CRT8qkHP629MzwQSo50%2B%2FqtseSvx8%2Byox0eIkpqxfE4b9oc8P%2FFErpwiIw`,
                'Origin': 'https://pasteboard.co',
                'Referer': 'https://pasteboard.co/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                'Sec-Fetch-Mode': 'cors',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (!data.fileName) {
            throw new Error("Upload failed");
        }

        return { url: `https://gcdnb.pbrd.co/images/${data.fileName}` };
      //  return { url: `https://pasteboard.co/${data.fileName}` };
    } finally {
        try {
            await fs.unlink(tempFilePath);
        } catch (cleanupError) {
            console.error("Cleanup Error:", cleanupError);
        }
    }
}

module.exports = {
  getMediaBuffer,
  getFileContentType,
  bufferToStream,
  uploadToPixhost,
  uploadToImgBB,
  uploadToPasteboard,
  uploadToCatbox,
  uploadToGithubCdn,
  uploadToGiftedCdn
};
