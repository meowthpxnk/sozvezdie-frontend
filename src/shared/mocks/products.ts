export type ProductMock = {
    id: string;
    imageSrc?: string;
    imageAlt?: string;
    images?: string[];
    priceText: string;
    stockCount: number;
    nameText: string;
    brandText: string;
    favourite?: boolean;
};

export type AuthorMock = {
    id: string;
    name: string;
    avatarImageSrc: string;
    bannerImageSrc: string;
    description: string;
};

export type BannerMock = {
    id: string;
    imageSrc: string;
    imageAlt: string;
    href: string;
    /** Заголовок на баннере (слева снизу) */
    titleText: string;
};

export const PRODUCTS_LIST: ProductMock[] = [
    {
        id: "1",
        imageSrc: "https://ghostshelf.shop/api/uploads/products/photo1/29f0a7ba-2641-43d0-b277-12a2b41d9742/default.jpg?v=1769862262215",
        images: [
            "https://ghostshelf.shop/api/uploads/products/photo1/29f0a7ba-2641-43d0-b277-12a2b41d9742/default.jpg?v=1769862262215",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800"
        ],
        priceText: "300 ₽",
        stockCount: 24,
        nameText: "Брелок Крутой872",
        brandText: "KERE",
    },
    {
        id: "2",
        imageSrc: "https://placeholdpicsum.dev/photo/800/800",
        images: [
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800"
        ],
        priceText: "300 ₽",
        stockCount: 15,
        nameText: "Брелок Крутой872",
        brandText: "KERE",
    },
    {
        id: "3",
        imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPIS_MT5gzSXgWzQQalTiDsxS2VCRIwpkBlQ&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPIS_MT5gzSXgWzQQalTiDsxS2VCRIwpkBlQ&s",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800"
        ],
        priceText: "300 ₽",
        stockCount: 3,
        nameText: "Брелок Крутой872",
        brandText: "KERE",
    },
    {
        id: "4",
        imageSrc: "https://preview.redd.it/some-of-my-favourite-bird-images-from-the-last-12-months-v0-xeq2o4k737se1.jpg?width=640&crop=smart&auto=webp&s=20e34f50040ae8a8520d257ec8116d64f095fc02",
        images: [
            "https://preview.redd.it/some-of-my-favourite-bird-images-from-the-last-12-months-v0-xeq2o4k737se1.jpg?width=640&crop=smart&auto=webp&s=20e34f50040ae8a8520d257ec8116d64f095fc02",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800"
        ],
        priceText: "300 ₽",
        stockCount: 42,
        nameText: "Брелок Крутой872",
        brandText: "LARGO",
    },
    {
        id: "5",
        imageSrc: "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
        images: [
            "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
        ],
        priceText: "300 ₽",
        stockCount: 8,
        nameText: "Брелок Крутой872",
        brandText: "LARGO",
    },
    {
        id: "6",
        imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YYh5Fk1u9VsWWr1MhkyQeOzeNbtnnMO96g&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YYh5Fk1u9VsWWr1MhkyQeOzeNbtnnMO96g&s",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
        ],
        priceText: "300 ₽",
        stockCount: 30,
        nameText: "Брелок Крутой872",
        brandText: "KERE",
    },
    {
        id: "7",
        imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YYh5Fk1u9VsWWr1MhkyQeOzeNbtnnMO96g&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YYh5Fk1u9VsWWr1MhkyQeOzeNbtnnMO96g&s",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
            "https://placeholdpicsum.dev/photo/800/800",
        ],
        priceText: "300 ₽",
        stockCount: 6,
        nameText: "Брелок Крутой872",
        brandText: "KERES",
    },
];


export const AUTHORS: AuthorMock[] = [
    {
        id: "1",
        name: "KERE",
        avatarImageSrc: "https://placeholdpicsum.dev/photo/200/200",
        bannerImageSrc: "https://placeholdpicsum.dev/photo/1280/500",
        description:
            "KERE создает яркие аксессуары и небольшие предметы декора, где смешивает графичные формы, смелые цвета и городские мотивы.",
    },
    {
        id: "2",
        name: "LARGO",
        avatarImageSrc: "https://photobooth.cdn.sports.ru/preset/message/b/76/3869ee28a4ac1a100a192d8ba2bfd.png?f=webp&q=90&s=2x&w=730",
        bannerImageSrc: "https://u.cubeupload.com/KawaiiSocks/674largowallpaper2deskt.jpg",
        description:
            "МООООЙ ОСТРОВ В ОКЕАНЕ АНЕ АНЕ АНЕ!",
    },
    {
        id: "3",
        name: "KERES",
        avatarImageSrc: "https://placeholdpicsum.dev/photo/200/200",
        bannerImageSrc: "https://placeholdpicsum.dev/photo/1280/500",
        description:
            "KERES развивает экспериментальное направление бренда: ограниченные серии, необычные материалы и акцент на деталях ручной работы.",
    },
    {
        id: "4",
        name: "GUGUGAGA",
        avatarImageSrc: "https://stationerypal.com/cdn/shop/files/Arknights_Endfield_Gugugaga_8.png?v=1775122265",
        bannerImageSrc: "https://i.ytimg.com/vi/EfEFGS_29vI/hqdefault.jpg",
        description:
            "Гу гу га га!",
    },
];

/** Авторы, у которых в каталоге есть хотя бы один товар (`brandText` совпадает с `name`). */
export const AUTHORS_WITH_PRODUCTS: AuthorMock[] = AUTHORS.filter((author) =>
    PRODUCTS_LIST.some((product) => product.brandText === author.name)
);

export const BANNERS: BannerMock[] = [
    {
        id: "banner-1",
        imageSrc: "https://placeholdpicsum.dev/photo/1280/560",
        imageAlt: "Промо-баннер весенней коллекции",
        href: "/products",
        titleText: "Весенняя коллекция — скидки до 30%",
    },
    {
        id: "banner-2",
        imageSrc: "https://placeholdpicsum.dev/photo/1280/560",
        imageAlt: "Промо-баннер новых поступлений",
        href: "/authors",
        titleText: "Новые авторы и свежие работы",
    },
    {
        id: "banner-3",
        imageSrc: "https://placeholdpicsum.dev/photo/1280/560",
        imageAlt: "Промо-баннер сезонной подборки",
        href: "/favorites",
        titleText: "Подборка недели в избранном",
    },
];
