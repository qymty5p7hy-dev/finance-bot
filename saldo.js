const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saldo')
        .setDescription('Mostra seu saldo atual'),
    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            const user = await User.findOne({ userId });
            const balance = user ? user.balance : 0;

            const embed = new EmbedBuilder()
                .setTitle('💰 Seu Saldo Atual')
                .setColor(balance >= 0 ? 0x00FF00 : 0xFF0000)
                .setDescription(`Seu saldo é de **R$ ${balance.toFixed(2)}**`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Ocorreu um erro ao buscar seu saldo.');
        }
    },
};
