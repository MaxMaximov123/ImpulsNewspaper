import fs from 'fs';

// fs.readdirSync('./src/assets/paperEdition/2020').forEach(file => {
//   console.log(file);
// });

function createFullPaths(obj) {
    obj.children = [];
    fs.readdirSync(obj.path).forEach(file => {
        if (/.+\..+/.test(file)) {
            obj.children.push({
                path: `${obj.path}/${file}`,
                label: file.match(/(.+)\..+/)[1],
                url: `${obj.url}/${file.match(/(.+)\..+/)[1]}`
            });
        } else if (/^[^\.]/.test(file)) {
            obj.children.push({
                path: `${obj.path}/${file}`,
                label: file,
                url: `${obj.url}/${file}`
            });
            createFullPaths(obj.children.at(-1));
        }
    });
}

let wood = {
    label: 'Бумажные издания',
    path: './src/assets/paperEdition',
    avatar: 'https://cdn-icons-png.flaticon.com/512/828/828370.png',
    url: 'paperEdition',
    children: [
    {
        label: '2021',
        icon: 'restaurant_menu',
        children: [
        { label: 'Quality ingredients' },
        { label: 'Good recipe' }
        ]
    },
    ]
};
createFullPaths(wood);

fs.writeFileSync('./src/assets/paperEditionPaths.json', JSON.stringify([wood], null, 2), 'utf-8');