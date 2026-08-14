async function connexionAdmin(email, motDePasse) {
    const { data, error } = await clientSupabase.auth.signInWithPassword({
        email: email,
        password: motDePasse
    });

    if (error) {
        console.error("Erreur de connexion :", error.message);
        alert("Connexion impossible");
        return;
    }

    console.log("Connecté :", data.user);
    alert("Connexion réussie");
}
