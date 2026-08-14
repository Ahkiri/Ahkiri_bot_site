async function connexionAdmin(email, motDePasse) {

    const { data, error } =
        await clientSupabase.auth.signInWithPassword({
            email: email.trim(),
            password: motDePasse
        });

    if (error) {
        console.error("Erreur Supabase :", error);

        alert(
            "Connexion impossible\n\n" +
            "Message : " + error.message
        );

        return;
    }

    console.log("Utilisateur connecté :", data.user);

    document.getElementById("connexion").style.display = "none";
    document.getElementById("zone-admin").style.display = "block";
}
