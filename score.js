const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Transaction = require('../../models/Transaction');
const Goal = require('../../models/Goal');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('Calcula seu Score Financeiro (0-100)'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        try {
            // 1. Controle de Gastos (40%) - Baseado na relação Receita/Despesa
            const transactions = await Transaction.find({ userId, date: { $gte: startOfMonth } });
            let income = 0, expense = 0;
            transactions.forEach(t => t.type === 'income' ? income += t.amount : expense += t.amount);
            
            let controlScore = 0;
            if (income > 0) {
                const ratio = expense / income;
                if (ratio <= 0.5) controlScore = 40;
                else if (ratio <= 0.8) controlScore = 30;
                else if (ratio <= 1) controlScore = 20;
                else controlScore = 10;
            }

            // 2. Progresso das Metas (40%)
            const goals = await Goal.find({ userId });
            let goalScore = 0;
            if (goals.length > 0) {
                const avgProgress = goals.reduce((acc, g) => acc + (g.currentAmount / g.targetAmount), 0) / goals.length;
                goalScore = Math.min(40, avgProgress * 40);
            }

            // 3. Regularidade (20%) - Baseado em dias com registros no mês
            const uniqueDays = new Set(transactions.map(t => t.date.toDateString())).size;
            const regularityScore = Math.min(20, (uniqueDays / 10) * 20); // 10 dias de registro = nota máxima

            const totalScore = Math.round(controlScore + goalScore + regularityScore);

            let level = 'Iniciante';
            if (totalScore > 80) level = 'Mestre das Finanças';
            else if (totalScore > 60) level = 'Poupador Consciente';
            else if (totalScore > 40) level = 'Em Aprendizado';

            const embed = new EmbedBuilder()
                .setTitle('🏆 Seu Score Financeiro')
                .setColor(totalScore > 70 ? 0x2ECC71 : 0xE67E22)
                .setDescription(`Seu score atual é **${totalScore}/100**\nNível: **${level}**`)
                .addFields(
                    { name: '📉 Controle de Gastos', value: `${controlScore}/40`, inline: true },
                    { name: '🎯 Progresso de Metas', value: `${goalScore.toFixed(0)}/40`, inline: true },
                    { name: '📅 Regularidade', value: `${regularityScore.toFixed(0)}/20`, inline: true }
                )
                .setFooter({ text: 'Score calculado com base nos dados do mês atual' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Erro ao calcular score.');
        }
    },
};
