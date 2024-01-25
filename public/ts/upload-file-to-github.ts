document.addEventListener('DOMContentLoaded', () => {
    const form =  document.querySelector('form');
    form!.addEventListener('submit', onSubmit);
});

interface Data {
    owner: string;
    repo: string;
    filename: string;
    token: string;
    content: string;
};

async function onSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const file = formData.get('myfile') as File;
    const srcData: string = await blobToBase64(file);
    const data: Data = {
        owner: formData.get('owner') as string,
        repo: formData.get('repo') as string,
        token: formData.get('token') as string,
        filename: file.name,
        content: srcData.split('base64,')[1]
    };

    displayThumbnail(srcData);
    uploadImage(data).then(res => {
        const log = res.message ? res.message : `upload success:
            <a href="${res.content.download_url}">${res.content.download_url}</a>`;
        document.querySelector('.log')!.innerHTML = log;
    })
}

function uploadImage(data: Data) {
    return fetch(
        `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.filename}`,
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

function displayThumbnail(src: string) {
    const newImage = document.createElement("img");
    newImage.src = src;
    document.querySelector('.preview')!.innerHTML = newImage.outerHTML;
}

function blobToBase64(blob: File) {
    return new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const srcData: string = fileReader.result! as string;
            resolve(srcData);
        };
        fileReader.readAsDataURL(blob);
    });
}
