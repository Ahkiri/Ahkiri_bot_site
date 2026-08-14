async function connexionAdmin(email, motDePasse) {
    const { data, error } = await clientSupabase.auth.signInWithPassword({
        email: email.trim(),
        password: motDePasse
    });

    if (error) {
        console.error("Erreur Supabase complète :", error);

        alert(
            "Connexion impossible\n\n" +
            "Message : " + error.message + "\n" +
            "Code : " + (error.code || "aucun")
        );

        return;
    }

    console.log("Utilisateur connecté :", data.user);
    alert("Connexion réussie !");
}
