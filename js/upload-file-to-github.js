document.addEventListener('DOMContentLoaded', () => {
    const form =  document.querySelector('form');
    form.addEventListener('submit', onSubmit);
});

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    let image = null;

    for (let pair of formData.entries()) {
        data[pair[0]] = pair[1];
    }

    const srcData = await blobToBase64(formData.get('myfile'));
    displayThumbnail(srcData);
    image = {
        name: formData.get('myfile').name,
        //type: formData.get('myfile').type,
        content: srcData.split('base64,')[1]
    };

    uploadImage({
        ...data,
        ...image
    }).then(res => {
        const log = res.message ? res.message : `upload success:
            <a href="${res.content.download_url}">${res.content.download_url}</a>`;
        document.querySelector('.log').innerHTML = log;
    })
}

function uploadImage(data) {
    return fetch(
        `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.name}`,
        {
            method: "PUT",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${data.token}`
            },
            body: JSON.stringify({
                message: "upload image from api",
                content: data.content
            })
        }
    ).then((res) => res.json());
}

function displayThumbnail(src) {
    const newImage = document.createElement("img");
    newImage.src = src;
    document.querySelector('.preview').innerHTML = newImage.outerHTML;
}

function blobToBase64(blob) {
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const srcData = fileReader.result;
            resolve(srcData);
        };
        fileReader.readAsDataURL(blob);
    });
}
