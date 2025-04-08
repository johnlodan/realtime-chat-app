import queryString from 'query-string';

export const sortQuery = (query: any) => {
    return queryString.stringify({ ...query }, { sort: (a, b) => a.localeCompare(b) })
}

export const generateRandomUsername = (len = 3) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        username += characters[randomIndex];
    }
    return username;
};

export const generateRandomName = () => {
    const firstNames = [
        "Liam", "Emma", "Noah", "Olivia", "Oliver", "Ava", "Elijah", "Sophia", "James", "Isabella",
        "William", "Mia", "Benjamin", "Amelia", "Lucas", "Harper", "Henry", "Evelyn", "Alexander", "Abigail"
    ];

    const lastNames = [
        "Santos", "Cruz", "Gonzales", "Reyes", "Bautista", "Dela Cruz", "Alvarez", "Fernandez",
        "Garcia", "Mendoza", "Rivera", "Lopez", "Cabrera", "Castro", "Diaz", "Torres", "Martinez",
        "Lim", "Magsaysay", "Pineda"
    ];

    const randomFirstIndex = Math.floor(Math.random() * firstNames.length);
    const randomLastIndex = Math.floor(Math.random() * lastNames.length);

    const firstName = firstNames[randomFirstIndex];
    const lastName = lastNames[randomLastIndex];

    return `${firstName} ${lastName}`; // Return full name in 'firstName lastName' format
}



export const getAvatarColor = (username: string) => {
    const colors = ['#992F1F', '#1F992F', '#1F2F99', '#991F5F', '#998A1F'];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
};