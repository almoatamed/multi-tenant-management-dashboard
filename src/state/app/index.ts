export const drawer = ref(true);

export const toggleDrawer = () => {
    drawer.value = !drawer.value;
};
