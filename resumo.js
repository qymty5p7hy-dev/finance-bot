const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Transaction = require('../../models/Transaction');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resumo')
        .setDescription('Gera um resumo financeiro')
        .addStringOption(option => 
            option.setName('periodo')
                .setDescription('Período do resumo')
                .setRequired(true)
                .addChoices(
                    { name: 'Semanal', value: 'semanal' },
                    { name: 'Mensal', value: 'mensal' }
                )),
    async execute(interaction) {
        const periodo = interaction.options.getString('periodo');
        const userId = interaction.user.id;
        const now = new Date();
        let startDate;

        if (periodo === 'semanal') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        try {
            const transactions = await Transaction.find({
                userId,
                date: { $gte: startDate }
            });

            let totalIncome = 0;
            let totalExpense = 0;
            const categories = {};

            transactions.forEach(t => {
                if (t.type === 'income') {
                    totalIncome += t.amount;
                } else {
                    totalExpense += t.amount;
                    categories[t.category] = (categories[t.category] || 0) + t.amount;
                }
            });

            const embed = new EmbedBuilder()
                .setTitle(`📊 Resumo ${periodo.charAt(0).toUpperCase() + periodo.slice(1)}`)
                .setColor(0x3498DB)
                .addFields(
                    { name: '📈 Total Receitas', value: `R$ ${totalIncome.toFixed(2)}`, inline: true },
                    { name: '📉 Total Despesas', value: `R$ ${totalExpense.toFixed(2)}`, inline: true },
                    { name: '⚖️ Balanço', value: `R$ ${(totalIncome - totalExpense).toFixed(2)}` }
                );

            let categoryText = '';
            for (const [cat, val] of Object.entries(categories)) {
                const percent = ((val / totalExpense) * 100).toFixed(2);
                categoryText += `**${cat}**: R$ ${val.toFixed(2)} (${percent}%)\n`;
            }

            if (categoryText) {
                embed.addFields({ name: '📂 Gastos por Categoria', value: categoryText });
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Ocorreu um erro ao gerar o resumo.');
        }
    },
};
